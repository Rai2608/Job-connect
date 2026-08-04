const crypto = require('crypto');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const CompanyProfile = require('../models/CompanyProfile');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'A user with this email address already exists');
    }

    const isDevelopmentWithoutEmail = env.NODE_ENV === 'development' && (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS);
    const verificationToken = isDevelopmentWithoutEmail ? undefined : crypto.randomBytes(32).toString('hex');

    const user = new User({
      fullName,
      email,
      password,
      role,
      verificationToken,
      isVerified: isDevelopmentWithoutEmail ? true : false,
    });

    await user.save();

    if (isDevelopmentWithoutEmail) {
      // Automatically initialize profiles upon verification (which is now registration)
      if (user.role === 'candidate') {
        const existingProfile = await CandidateProfile.findOne({ userId: user._id });
        if (!existingProfile) {
          await CandidateProfile.create({ userId: user._id });
        }
      } else if (user.role === 'company') {
        const existingProfile = await CompanyProfile.findOne({ userId: user._id });
        if (!existingProfile) {
          await CompanyProfile.create({
            userId: user._id,
            companyName: `${user.fullName}'s Organization`,
          });
        }
      }
    } else {
      // Send verification email
      await sendVerificationEmail(user.email, user.fullName, verificationToken);
    }

    // Prepare clean user data for response
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    const successMessage = isDevelopmentWithoutEmail
      ? 'Registration successful! Account auto-verified for development.'
      : 'Registration successful. Please check your email to verify your account.';

    return ApiResponse.success(res, userData, successMessage, 201);
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      throw new ApiError(400, 'Verification token is required');
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new ApiError(400, 'Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Automatically initialize profiles upon verification
    if (user.role === 'candidate') {
      const existingProfile = await CandidateProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        await CandidateProfile.create({ userId: user._id });
      }
    } else if (user.role === 'company') {
      const existingProfile = await CompanyProfile.findOne({ userId: user._id });
      if (!existingProfile) {
        // Use user's name as default company name to start with
        await CompanyProfile.create({
          userId: user._id,
          companyName: `${user.fullName}'s Organization`,
        });
      }
    }

    return ApiResponse.success(res, {}, 'Email verified successfully. You can now log in.');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isVerified) {
      throw new ApiError(403, 'Please verify your email address before logging in');
    }

    if (user.isSuspended) {
      throw new ApiError(403, 'Your account has been suspended. Please contact support.');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    return ApiResponse.success(res, { user: userData, accessToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token missing');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User associated with token does not exist');
    }

    if (user.isSuspended) {
      throw new ApiError(403, 'Account suspended');
    }

    const accessToken = generateAccessToken(user);

    return ApiResponse.success(res, { accessToken }, 'Access token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return ApiResponse.success(res, {}, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user doesn't exist for security reasons, so attackers don't know who has accounts
      return ApiResponse.success(res, {}, 'If that email address exists, a password reset link has been sent.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    return ApiResponse.success(res, {}, 'Password reset email sent successfully.');
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    user.password = password; // pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return ApiResponse.success(res, {}, 'Password reset successfully. You can now log in.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
