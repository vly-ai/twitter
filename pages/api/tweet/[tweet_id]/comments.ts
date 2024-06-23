import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import Comment from '../../../../models/Comment';
import { validateTweetId, validationMiddleware } from '../../../../lib/expressValidatorTweetDetail';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
handler.use(...validateTweetId);
handler.use(validationMiddleware);

handler.get(async (req, res) => {
  await dbConnect();
  const { tweet_id } = req.query;
  try {
    const comments = await Comment.find({ tweet: tweet_id }).populate('author');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;