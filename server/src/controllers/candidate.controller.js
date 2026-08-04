const CandidateProfile = require('../models/CandidateProfile');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { uploadFile } = require('../services/storage.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ userId: req.user._id }).populate('userId', 'fullName email');
    if (!profile) {
      // Auto-create profile if somehow missing
      profile = await CandidateProfile.create({ userId: req.user._id });
      profile = await profile.populate('userId', 'fullName email');
    }
    return ApiResponse.success(res, profile, 'Candidate profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { headline, summary, skills, experience, education, links } = req.body;

    let profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ userId: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (summary !== undefined) profile.summary = summary;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (links !== undefined) profile.links = links;

    await profile.save();
    const updatedProfile = await profile.populate('userId', 'fullName email');
    return ApiResponse.success(res, updatedProfile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Please upload a resume file');
    }

    const resumeUrl = await uploadFile(req.file, 'resumes');

    let profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CandidateProfile({ userId: req.user._id });
    }

    profile.resumeUrl = resumeUrl;
    await profile.save();

    return ApiResponse.success(res, { resumeUrl }, 'Resume uploaded successfully');
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return ApiResponse.success(res, [], 'No applications found');
    }

    const applications = await Application.find({ candidateId: profile._id })
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'companyName logoUrl industry',
        },
      })
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, applications, 'Candidate applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const toggleSaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      throw new ApiError(400, 'Job ID is required');
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      throw new ApiError(404, 'Job not found');
    }

    let profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await CandidateProfile.create({ userId: req.user._id });
    }

    const jobIdx = profile.savedJobs.indexOf(jobId);
    let message = '';
    if (jobIdx > -1) {
      profile.savedJobs.splice(jobIdx, 1);
      message = 'Job removed from bookmarks';
    } else {
      profile.savedJobs.push(jobId);
      message = 'Job saved to bookmarks';
    }

    await profile.save();
    return ApiResponse.success(res, profile.savedJobs, message);
  } catch (error) {
    next(error);
  }
};

const getSavedJobs = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user._id }).populate({
      path: 'savedJobs',
      match: { status: 'active' }, // only populate active jobs
      populate: {
        path: 'companyId',
        select: 'companyName logoUrl industry',
      },
    });

    const savedJobs = profile ? profile.savedJobs : [];
    return ApiResponse.success(res, savedJobs, 'Saved jobs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getApplications,
  toggleSaveJob,
  getSavedJobs,
};
