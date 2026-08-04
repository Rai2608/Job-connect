const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: {
      values: ['skill', 'category'],
      message: '{VALUE} is not a valid taxonomy type',
    },
    required: [true, 'Taxonomy type is required'],
  },
}, {
  timestamps: true,
});

const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
module.exports = SkillCategory;
