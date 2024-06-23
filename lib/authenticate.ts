import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'YOUR_SECRET_KEY';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    req.decoded = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}