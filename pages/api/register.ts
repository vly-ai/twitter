import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { hashPassword } from '../../lib/bcrypt';
import { validateRegistration, validationMiddleware } from '../../lib/expressValidator';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(...validateRegistration);
handler.use(validationMiddleware);

handler.post(async (req, res) => {
  await dbConnect();
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default handler;