import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Tweet from '../../../models/Tweet';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const tweets = await Tweet.find({}).sort({ likes: -1 }).limit(10).populate('author');
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}

export default handler;
