import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'YOUR_SECRET_KEY';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}