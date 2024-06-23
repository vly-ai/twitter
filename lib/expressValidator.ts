import { check, validationResult } from 'express-validator';

export const validateTweet = [
  check('text')
    .isLength({ min: 1 })
    .withMessage('Tweet cannot be empty')
    .isLength({ max: 280 })
    .withMessage('Tweet exceeds character limit'),
];

export function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}