import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { verifyToken } from '../../lib/auth';
import upload from '../../lib/multer';
import { validationResult, check } from 'express-validator';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(upload);
handler.use([
  check('username').isLength({ min: 1 }).withMessage('Username is required'),
  check('bio').optional().isLength({ max: 160 }).withMessage('Bio must be within 160 characters')
]);
handler.use((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
});

handler.post(async (req, res) => {
  await dbConnect();
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded: any = verifyToken(token);
    const { username, bio } = req.body;
    const profilePicture = req.file ? req.file.buffer.toString('base64') : undefined;

    await User.updateOne(
      { _id: decoded.id },
      { username, bio, profilePicture }
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;