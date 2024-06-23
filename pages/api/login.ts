import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { comparePassword } from '../../lib/bcrypt';
import { generateToken } from '../../lib/auth';
import { validateLogin, validationMiddleware } from '../../lib/expressValidator';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(...validateLogin);
handler.use(validationMiddleware);

handler.post(async (req, res) => {
  await dbConnect();
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, email: user.email });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;