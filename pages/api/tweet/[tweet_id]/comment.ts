import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/dbConnect';
import Comment from '../../../../models/Comment';
import { authenticate } from '../../../../lib/authenticate';
import { validateTweetId, validateCommentContent, validationMiddleware } from '../../../../lib/expressValidatorTweetDetail';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();
handler.use(authenticate);
handler.use(...validateTweetId);
handler.use(...validateCommentContent);
handler.use(validationMiddleware);

handler.post(async (req, res) => {
  await dbConnect();
  const { tweet_id } = req.query;
  const { comment } = req.body;
  const userId = req.decoded.id;
  try {
    const newComment = await Comment.create({ author: userId, tweet: tweet_id, content: comment });
    res.status(201).json({ message: 'Comment posted successfully', newComment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;