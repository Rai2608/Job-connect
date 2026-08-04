const Job = require('../models/Job');
const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');
const CandidateProfile = require('../models/CandidateProfile');
const { createNotification } = require('../services/notification.service');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const createJob = async (req, res, next) => {
  try {
    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile) {
      throw new ApiError(404, 'Please complete your company profile before posting a job.');
    }

    // Verify company status
    if (companyProfile.verificationStatus !== 'verified') {
      throw new ApiError(403, 'Your company account is pending verification. You cannot post jobs yet.');
    }

    const {
      title,
      description,
      requirements,
      skills,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      deadline,
    } = req.body;

    const job = new Job({
      companyId: companyProfile._id,
      title,
      description,
      requirements,
      skills,
      location,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      deadline,
    });

    await job.save();
    return ApiResponse.success(res, job, 'Job posted successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile) {
      throw new ApiError(404, 'Company profile not found');
    }

    const job = await Job.findById(id);
    if (!job) {
      throw new ApiError(404, 'Job not found');
    }

    // Ownership check
    if (job.companyId.toString() !== companyProfile._id.toString()) {
      throw new ApiError(403, 'You are not authorized to update this job posting');
    }

    const updates = req.body;
    // Prevent updating companyId
    delete updates.companyId;

    const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    return ApiResponse.success(res, updatedJob, 'Job posting updated successfully');
  } catch (error) {
    next(error);
  }
};

const archiveJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile) {
      throw new ApiError(404, 'Company profile not found');
    }

    const job = await Job.findById(id);
    if (!job) {
      throw new ApiError(404, 'Job not found');
    }

    // Ownership check
    if (job.companyId.toString() !== companyProfile._id.toString()) {
      throw new ApiError(403, 'You are not authorized to archive this job posting');
    }

    job.status = 'closed';
    await job.save();

    return ApiResponse.success(res, job, 'Job archived/closed successfully');
  } catch (error) {
    next(error);
  }
};

const listJobs = async (req, res, next) => {
  try {
    const {
      q,
      location,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      skills,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: 'active' };

    // Search keywords
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Salary range filters
    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }
    if (maxSalary) {
      query.salaryMin = { $lte: Number(maxSalary) };
    }

    // Skills filter (expects comma separated list or array)
    if (skills) {
      const skillsArr = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      query.skills = { $all: skillsArr.map(s => new RegExp(`^${s}$`, 'i')) };
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default: newest
    if (sort === 'salary') {
      sortQuery = { salaryMax: -1, salaryMin: -1 };
    } else if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    
    const jobs = await Job.find(query)
      .populate('companyId', 'companyName logoUrl industry size')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.paginate(res, jobs, page, limit, total, 'Jobs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getJobDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate('companyId', 'companyName logoUrl industry size description website');
    if (!job) {
      throw new ApiError(404, 'Job not found');
    }
    return ApiResponse.success(res, job, 'Job details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getCompanyJobs = async (req, res, next) => {
  try {
    const companyProfile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!companyProfile) {
      throw new ApiError(404, 'Company profile not found');
    }

    const jobs = await Job.find({ companyId: companyProfile._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, jobs, 'Company job postings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverNote } = req.body;
    if (!jobId) {
      throw new ApiError(400, 'Job ID is required');
    }

    const job = await Job.findById(jobId).populate('companyId');
    if (!job || job.status !== 'active') {
      throw new ApiError(404, 'Job not found or is no longer accepting applications');
    }

    const candidateProfile = await CandidateProfile.findOne({ userId: req.user._id }).populate('userId');
    if (!candidateProfile) {
      throw new ApiError(404, 'Candidate profile not found');
    }

    if (!candidateProfile.resumeUrl) {
      throw new ApiError(400, 'Please upload a resume to your profile before applying.');
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({ jobId, candidateId: candidateProfile._id });
    if (existingApplication) {
      throw new ApiError(409, 'You have already applied to this job.');
    }

    const application = new Application({
      jobId,
      candidateId: candidateProfile._id,
      resumeUrl: candidateProfile.resumeUrl,
      coverNote,
      status: 'Applied',
    });

    application.statusHistory.push({
      status: 'Applied',
      updatedBy: req.user._id,
      notes: 'Application submitted by candidate.',
    });

    await application.save();

    // Notify company
    const companyUser = job.companyId.userId; // Company User ObjectId
    await createNotification(
      companyUser,
      'NEW_APPLICATION',
      `A new candidate (${candidateProfile.userId.fullName}) has applied for your job posting: '${job.title}'.`
    );

    return ApiResponse.success(res, application, 'Application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  updateJob,
  archiveJob,
  listJobs,
  getJobDetails,
  getCompanyJobs,
  applyToJob,
};
