const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CandidateProfile',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Interview schedule date/time is required'],
  },
  mode: {
    type: String,
    enum: {
      values: ['onsite', 'remote', 'phone'],
      message: '{VALUE} is not a valid interview mode',
    },
    required: [true, 'Interview mode is required'],
  },
  locationUrl: {
    type: String,
    trim: true,
    required: [true, 'Interview location or online link is required'],
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, {
  timestamps: true,
});

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;
