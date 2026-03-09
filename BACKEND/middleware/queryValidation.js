import { body, validationResult } from 'express-validator';

/**
 * Validation rules for the ask-jiji endpoint
 */
export const askJijiValidationRules = [
  body('query')
    .exists({ checkFalsy: true })
    .withMessage('Query is required')
    .isString()
    .withMessage('Query must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Query must be between 1 and 1000 characters'),
  
  body('userId')
    .optional()
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  
  body('topic')
    .optional()
    .isString()
    .withMessage('Topic must be a string')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Topic must not exceed 100 characters'),
];

/**
 * Middleware to validate request and return errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};
