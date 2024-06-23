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
    const tweet = await Tweet.findById(tweet_id);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    const isLiked = tweet.likes.includes(userId);
    if (isLiked) {
      tweet.likes.pull(userId);
    } else {
      tweet.likes.push(userId);
    }
    await tweet.save();
    res.status(200).json({ message: isLiked ? 'Unliked successfully' : 'Liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;