import jwt from 'jsonwebtoken';

const JWT_SECRET = 'not-really-secret-jwt-key';

export const signJWT = (userId: string): string => {
  const payload = { userId };
  return jwt.sign(payload, JWT_SECRET);
};
