const authController = require('../src/controllers/auth.controller');
const User = require('../src/models/User');
const ApiResponse = require('../src/utils/apiResponse');
const ApiError = require('../src/utils/apiError');
const { sendVerificationEmail } = require('../src/services/email.service');

// Mock User model
jest.mock('../src/models/User');

// Mock email service
jest.mock('../src/services/email.service', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
}));

// Mock ApiResponse
jest.mock('../src/utils/apiResponse', () => ({
  success: jest.fn((res, data, message, status) => {
    return res.status(status || 200).json({ success: true, data, message });
  }),
}));

describe('Auth Controller - Register Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        fullName: 'Test Candidate',
        email: 'test@jobconnect.com',
        password: 'Password123!',
        role: 'candidate',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should register a new user successfully and send verification email', async () => {
    // Mock User.findOne to return null (user doesn't exist yet)
    User.findOne.mockResolvedValue(null);

    // Mock save method
    const mockSave = jest.fn().mockResolvedValue(true);
    User.mockImplementation(() => ({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      verificationToken: 'mock-token',
      save: mockSave,
      _id: 'mock-user-id',
    }));

    await authController.register(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(mockSave).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalled();
    expect(ApiResponse.success).toHaveBeenCalledWith(
      res,
      expect.objectContaining({
        fullName: 'Test Candidate',
        email: 'test@jobconnect.com',
        role: 'candidate',
      }),
      expect.any(String),
      201
    );
  });

  it('should throw conflict error if email is already registered', async () => {
    // Mock User.findOne to return existing user
    User.findOne.mockResolvedValue({ email: 'test@jobconnect.com' });

    await authController.register(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed.statusCode).toBe(409);
    expect(errorPassed.message).toBe('A user with this email address already exists');
  });
});
