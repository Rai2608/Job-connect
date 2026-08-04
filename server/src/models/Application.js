const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: {
    type: String,
    trim: true,
  },
});

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CandidateProfile',
    required: true,
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume is required for applying'],
  },
  coverNote: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
    default: 'Applied',
  },
  statusHistory: [statusHistorySchema],
}, {
  timestamps: true,
});

// Compound index to prevent duplicate applications for a job by the same candidate
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
