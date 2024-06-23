import { check, validationResult } from 'express-validator';

export const validateTweetId = [
  check('tweet_id')
    .isMongoId()
    .withMessage('Invalid tweet ID')
];

export function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateCommentContent = [
  check('comment')
    .isLength({ min: 1 })
    .withMessage('Comment cannot be empty')
    .isLength({ max: 280 })
    .withMessage('Comment exceeds character limit')
];