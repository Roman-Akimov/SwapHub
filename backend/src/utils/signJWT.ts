import jwt from 'jsonwebtoken';
import { env } from '../lib/env';

export const signJWT = (userId: string): string => {
  const payload = { userId };
  return jwt.sign(payload, env.JWT_SECRET);
};
