const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const User = require('../models/User');
const { uploadFile } = require('../services/storage.service');
const { createNotification } = require('../services/notification.service');
const { sendApplicationStatusEmail, sendInterviewScheduledEmail } = require('../services/email.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    let profile = await CompanyProfile.findOne({ userId: req.user._id }).populate('userId', 'fullName email');
    if (!profile) {
      profile = await CompanyProfile.create({
        userId: req.user._id,
        companyName: `${req.user.fullName}'s Organization`,
      });
      profile = await profile.populate('userId', 'fullName email');
    }
    return ApiResponse.success(res, profile, 'Company profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { companyName, industry, website, description, size, foundedYear } = req.body;

    let profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CompanyProfile({ userId: req.user._id });
    }

    if (companyName !== undefined) profile.companyName = companyName;
    if (industry !== undefined) profile.industry = industry;
    if (website !== undefined) profile.website = website;
    if (description !== undefined) profile.description = description;
    if (size !== undefined) profile.size = size;
    if (foundedYear !== undefined) profile.foundedYear = foundedYear;

    // Reset status to pending when profile changes significantly (optional, let's keep it as is or leave verificationStatus unchanged)
    // profile.verificationStatus = 'pending';

    await profile.save();
    const updatedProfile = await profile.populate('userId', 'fullName email');
    return ApiResponse.success(res, updatedProfile, 'Company profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Please upload a company logo file');
    }

    const logoUrl = await uploadFile(req.file, 'logos');

    let profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CompanyProfile({ userId: req.user._id, companyName: `${req.user.fullName}'s Organization` });
    }

    profile.logoUrl = logoUrl;
    await profile.save();

    return ApiResponse.success(res, { logoUrl }, 'Company logo uploaded successfully');
  } catch (error) {
    next(error);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, sort = 'desc' } = req.query;

    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile) {
      throw new ApiError(404, 'Company profile not found');
    }

    const job = await Job.findById(jobId);
    if (!job) {
      throw new ApiError(404, 'Job posting not found');
    }

    // Ownership check
    if (job.companyId.toString() !== companyProfile._id.toString()) {
      throw new ApiError(403, 'You do not have access to view applicants for this job');
    }

    const query = { jobId };
    if (status) {
      query.status = status;
    }

    const sortOrder = sort === 'asc' ? 1 : -1;

    const applicants = await Application.find(query)
      .populate({
        path: 'candidateId',
        populate: {
          path: 'userId',
          select: 'fullName email',
        },
      })
      .sort({ createdAt: sortOrder });

    return ApiResponse.success(res, applicants, 'Applicants retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const checkStatusTransition = (currentStatus, newStatus) => {
  if (currentStatus === newStatus) return true;
  
  if (currentStatus === 'Rejected' || currentStatus === 'Hired') {
    return false; // Terminal states
  }

  if (newStatus === 'Rejected') return true; // Can reject from anywhere

  const sequence = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Hired'];
  const curIndex = sequence.indexOf(currentStatus);
  const newIndex = sequence.indexOf(newStatus);

  if (curIndex === -1 || newIndex === -1) return false;

  // sequential progression
  return newIndex === curIndex + 1;
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      throw new ApiError(400, 'Status is required');
    }

    const application = await Application.findById(applicationId)
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' },
      })
      .populate({
        path: 'candidateId',
        populate: { path: 'userId' },
      });

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile || application.jobId.companyId._id.toString() !== companyProfile._id.toString()) {
      throw new ApiError(403, 'You do not have access to manage this application');
    }

    // Validate status transition
    if (!checkStatusTransition(application.status, status)) {
      throw new ApiError(400, `Invalid status transition from '${application.status}' to '${status}'.`);
    }

    const oldStatus = application.status;
    application.status = status;
    application.statusHistory.push({
      status,
      updatedBy: req.user._id,
      notes,
    });

    await application.save();

    // Trigger Notification & Email
    const candidateUserId = application.candidateId.userId._id;
    const candidateEmail = application.candidateId.userId.email;
    const candidateName = application.candidateId.userId.fullName;
    const jobTitle = application.jobId.title;
    const companyName = companyProfile.companyName;

    await createNotification(
      candidateUserId,
      'APPLICATION_STATUS_CHANGE',
      `Your application for '${jobTitle}' at '${companyName}' status is now: ${status}.`
    );

    await sendApplicationStatusEmail(candidateEmail, candidateName, jobTitle, companyName, status, notes);

    return ApiResponse.success(res, application, `Application status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, scheduledAt, mode, locationUrl, notes } = req.body;

    if (!applicationId || !scheduledAt || !mode || !locationUrl) {
      throw new ApiError(400, 'applicationId, scheduledAt, mode, and locationUrl are required');
    }

    const application = await Application.findById(applicationId)
      .populate({
        path: 'jobId',
        populate: { path: 'companyId' },
      })
      .populate({
        path: 'candidateId',
        populate: { path: 'userId' },
      });

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile || application.jobId.companyId._id.toString() !== companyProfile._id.toString()) {
      throw new ApiError(403, 'You do not have permission to schedule interviews for this candidate');
    }

    // Transition application status to 'Interview Scheduled' if allowed
    const targetStatus = 'Interview Scheduled';
    if (application.status !== targetStatus) {
      if (!checkStatusTransition(application.status, targetStatus)) {
        throw new ApiError(400, `Cannot schedule interview. Invalid status transition from '${application.status}' to '${targetStatus}'`);
      }
      
      application.status = targetStatus;
      application.statusHistory.push({
        status: targetStatus,
        updatedBy: req.user._id,
        notes: `Interview scheduled on ${new Date(scheduledAt).toLocaleString()}`,
      });
      await application.save();
    }

    const interview = new Interview({
      applicationId,
      candidateId: application.candidateId._id,
      companyId: companyProfile._id,
      scheduledAt,
      mode,
      locationUrl,
      notes,
    });

    await interview.save();

    const candidateUserId = application.candidateId.userId._id;
    const candidateEmail = application.candidateId.userId.email;
    const candidateName = application.candidateId.userId.fullName;
    const jobTitle = application.jobId.title;
    const companyName = companyProfile.companyName;

    // Trigger Notification
    await createNotification(
      candidateUserId,
      'INTERVIEW_SCHEDULED',
      `An interview has been scheduled for '${jobTitle}' at '${companyName}' on ${new Date(scheduledAt).toLocaleString()}.`
    );

    // Trigger Email
    await sendInterviewScheduledEmail(
      candidateEmail,
      candidateName,
      jobTitle,
      companyName,
      scheduledAt,
      mode,
      locationUrl,
      notes
    );

    return ApiResponse.success(res, interview, 'Interview scheduled successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadLogo,
  getApplicants,
  updateApplicationStatus,
  scheduleInterview,
};
