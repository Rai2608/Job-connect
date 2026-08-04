const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  skills: [{
    type: String,
    trim: true,
  }],
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  jobType: {
    type: String,
    enum: {
      values: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      message: '{VALUE} is not a valid job type',
    },
    required: [true, 'Job type is required'],
  },
  experienceLevel: {
    type: String,
    enum: {
      values: ['entry', 'mid', 'senior', 'lead', 'executive'],
      message: '{VALUE} is not a valid experience level',
    },
    required: [true, 'Experience level is required'],
  },
  salaryMin: {
    type: Number,
    min: [0, 'Salary cannot be negative'],
  },
  salaryMax: {
    type: Number,
    min: [0, 'Salary cannot be negative'],
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Indexes
jobSchema.index({ status: 1, createdAt: -1 });

// Text index for search
jobSchema.index({ title: 'text', skills: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
