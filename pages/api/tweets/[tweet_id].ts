import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Tweet from '../../../models/Tweet';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { tweet_id } = req.query;

  try {
    const tweet = await Tweet.findById(tweet_id).populate('author');
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    res.status(200).json(tweet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}

export default handler;
