import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Tweet from '../../../models/Tweet';
import { verifyToken } from '../../../lib/auth';
import { validateTweet, validationMiddleware } from '../../../lib/expressValidator';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();

// Use validation middleware
handler.use(...validateTweet);
handler.use(validationMiddleware);

handler.post(async (req, res) => {
  await dbConnect();
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded: any = verifyToken(token);
    const { text } = req.body;
    const tweet = await Tweet.create({ text, author: decoded.id });
    res.status(201).json(tweet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;