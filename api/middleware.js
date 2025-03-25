import jwt from 'jsonwebtoken';

export function authenticateToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return null;
  }
  
  try {
    const secret = process.env.JWT_SECRET_KEY || 'default_jwt_secret_for_development';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
} 