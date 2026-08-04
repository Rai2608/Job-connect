const { body } = require('express-validator');
const validate = require('./validate');

const candidateProfileValidator = [
  body('headline')
    .optional()
    .trim(),
  body('summary')
    .optional()
    .trim(),
  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array of strings'),
  body('links.linkedin')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: false }).withMessage('Invalid LinkedIn URL'),
  body('links.github')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: false }).withMessage('Invalid GitHub URL'),
  body('links.portfolio')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: false }).withMessage('Invalid Portfolio URL'),
  validate,
];

const companyProfileValidator = [
  body('companyName')
    .notEmpty().withMessage('Company name is required')
    .trim(),
  body('industry')
    .optional()
    .trim(),
  body('website')
    .optional({ checkFalsy: true })
    .isURL({ require_protocol: false }).withMessage('Invalid Website URL'),
  body('description')
    .optional()
    .trim(),
  body('size')
    .optional()
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).withMessage('Invalid company size range'),
  body('foundedYear')
    .optional()
    .isInt({ min: 1700, max: new Date().getFullYear() }).withMessage('Invalid founded year'),
  validate,
];

module.exports = {
  candidateProfileValidator,
  companyProfileValidator,
};
