const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
});

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
});

const candidateProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  headline: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  experience: [experienceSchema],
  education: [educationSchema],
  links: {
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
  },
  resumeUrl: {
    type: String,
    trim: true,
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
}, {
  timestamps: true,
});

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);
module.exports = CandidateProfile;
