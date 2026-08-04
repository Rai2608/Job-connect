const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const CandidateProfile = require('../models/CandidateProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SkillCategory = require('../models/SkillCategory');
const { createNotification } = require('../services/notification.service');
const { sendCompanyVerificationEmail } = require('../services/email.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// 1. Company Moderation
const getPendingCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyProfile.find({ verificationStatus: 'pending' })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, companies, 'Pending company registrations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const verifyCompany = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['verified', 'rejected'].includes(status)) {
      throw new ApiError(400, "Status must be either 'verified' or 'rejected'");
    }

    const company = await CompanyProfile.findById(companyId).populate('userId');
    if (!company) {
      throw new ApiError(404, 'Company profile not found');
    }

    company.verificationStatus = status;
    if (status === 'rejected') {
      company.rejectionReason = rejectionReason || 'Information provided was insufficient.';
    } else {
      company.rejectionReason = undefined;
    }

    await company.save();

    // Trigger Notification & Email
    const isVerified = status === 'verified';
    await createNotification(
      company.userId._id,
      'COMPANY_VERIFICATION_RESULT',
      `Your company registration has been ${status}.`
    );

    await sendCompanyVerificationEmail(company.userId.email, company.companyName, isVerified, company.rejectionReason);

    return ApiResponse.success(res, company, `Company has been successfully ${status}`);
  } catch (error) {
    next(error);
  }
};

// 2. User Moderation
const listUsers = async (req, res, next) => {
  try {
    const { role, isSuspended, q, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isSuspended !== undefined) query.isSuspended = isSuspended === 'true';
    if (q) {
      query.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.paginate(res, users, page, limit, total, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const toggleUserSuspension = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isSuspended } = req.body;

    if (isSuspended === undefined) {
      throw new ApiError(400, 'isSuspended field is required');
    }

    if (userId === req.user._id.toString()) {
      throw new ApiError(400, 'You cannot suspend your own admin account');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.isSuspended = !!isSuspended;
    await user.save();

    return ApiResponse.success(res, { id: user._id, isSuspended: user.isSuspended }, `User account has been ${user.isSuspended ? 'suspended' : 'reactivated'}`);
  } catch (error) {
    next(error);
  }
};

// 3. Job Moderation
const listJobs = async (req, res, next) => {
  try {
    const { status, q, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId', 'companyName logoUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.paginate(res, jobs, page, limit, total, 'Jobs retrieved for moderation');
  } catch (error) {
    next(error);
  }
};

const moderateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body; // usually admin can force close ('closed')

    if (!['active', 'closed'].includes(status)) {
      throw new ApiError(400, "Invalid status. Must be 'active' or 'closed'");
    }

    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      throw new ApiError(404, 'Job not found');
    }

    job.status = status;
    await job.save();

    // Notify company
    const companyUserId = job.companyId.userId;
    await createNotification(
      companyUserId,
      'JOB_MODERATION',
      `Admin has set the status of your job posting '${job.title}' to: ${status}.`
    );

    return ApiResponse.success(res, job, `Job posting has been set to: ${status}`);
  } catch (error) {
    next(error);
  }
};

// 4. Taxonomy CRUD
const createSkillCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      throw new ApiError(400, 'Name and Type are required');
    }

    const item = new SkillCategory({ name, type });
    await item.save();

    return ApiResponse.success(res, item, 'Taxonomy item created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const listSkillCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type) query.type = type;

    const items = await SkillCategory.find(query).sort({ name: 1 });
    return ApiResponse.success(res, items, 'Taxonomy items retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const deleteSkillCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await SkillCategory.findByIdAndDelete(id);
    if (!item) {
      throw new ApiError(404, 'Taxonomy item not found');
    }
    return ApiResponse.success(res, {}, 'Taxonomy item deleted successfully');
  } catch (error) {
    next(error);
  }
};

// 5. Dashboard Analytics
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalCompaniesCount = await User.countDocuments({ role: 'company' });

    const pendingCompanies = await CompanyProfile.countDocuments({ verificationStatus: 'pending' });
    const verifiedCompanies = await CompanyProfile.countDocuments({ verificationStatus: 'verified' });
    const rejectedCompanies = await CompanyProfile.countDocuments({ verificationStatus: 'rejected' });

    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();

    // Time ranges
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const appsLast7Days = await Application.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const appsLast30Days = await Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const analytics = {
      users: {
        total: totalUsers,
        candidates: totalCandidates,
        companies: totalCompaniesCount,
      },
      companies: {
        pending: pendingCompanies,
        verified: verifiedCompanies,
        rejected: rejectedCompanies,
      },
      jobs: {
        active: activeJobs,
      },
      applications: {
        total: totalApplications,
        last7Days: appsLast7Days,
        last30Days: appsLast30Days,
      },
    };

    return ApiResponse.success(res, analytics, 'Dashboard analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingCompanies,
  verifyCompany,
  listUsers,
  toggleUserSuspension,
  listJobs,
  moderateJob,
  createSkillCategory,
  listSkillCategories,
  deleteSkillCategory,
  getDashboardAnalytics,
};
