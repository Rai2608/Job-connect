const { body } = require('express-validator');
const validate = require('./validate');

const jobCreateValidator = [
  body('title')
    .notEmpty().withMessage('Job title is required')
    .trim(),
  body('description')
    .notEmpty().withMessage('Job description is required'),
  body('location')
    .notEmpty().withMessage('Location is required')
    .trim(),
  body('jobType')
    .notEmpty().withMessage('Job type is required')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('experienceLevel')
    .notEmpty().withMessage('Experience level is required')
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive']).withMessage('Invalid experience level'),
  body('requirements')
    .optional()
    .isArray().withMessage('Requirements must be an array of strings'),
  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array of strings'),
  body('salaryMin')
    .optional()
    .isNumeric().withMessage('Minimum salary must be a number'),
  body('salaryMax')
    .optional()
    .isNumeric().withMessage('Maximum salary must be a number'),
  body('deadline')
    .optional()
    .isISO8601().toDate().withMessage('Deadline must be a valid date'),
  validate,
];

module.exports = {
  jobCreateValidator,
};
