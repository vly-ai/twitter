import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import Tweet from '../../../../models/Tweet';
import { authenticate } from '../../../../lib/authenticate';
import { validateTweetId, validationMiddleware } from '../../../../lib/expressValidatorTweetDetail';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
handler.use(authenticate);
handler.use(...validateTweetId);
handler.use(validationMiddleware);

handler.post(async (req, res) => {
  await dbConnect();
  const { tweet_id } = req.query;
  const userId = req.decoded.id;
  try {
    const originalTweet = await Tweet.findById(tweet_id);
    if (!originalTweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    const retweet = await Tweet.create({ text: originalTweet.text, author: userId, retweets: originalTweet.retweets + 1 });
    originalTweet.retweets += 1;
    await originalTweet.save();
    res.status(201).json({ message: 'Retweeted successfully', retweet });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;