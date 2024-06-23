import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { verifyToken } from '../../../lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded: any = verifyToken(token);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const { targetUserId } = req.body;
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);
    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(decoded.id);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(decoded.id);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}

export default handler;