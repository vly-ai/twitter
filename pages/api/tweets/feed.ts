import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Tweet from '../../../models/Tweet';
import { verifyToken } from '../../../lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded: any = verifyToken(token);
    const tweets = await Tweet.find({ author: { $in: decoded.following } }).sort({ createdAt: -1 }).populate('author');
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}

export default handler;
