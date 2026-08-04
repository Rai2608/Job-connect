const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  logoUrl: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    enum: {
      values: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      message: '{VALUE} is not a valid company size range',
    },
  },
  foundedYear: {
    type: Number,
    min: [1700, 'Founded year cannot be before 1700'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
module.exports = CompanyProfile;
