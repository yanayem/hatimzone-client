import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user from token
export const getUserFromToken = (token) => {
  const decoded = verifyToken(token);
  return decoded ? { id: decoded.id, role: decoded.role } : null;
};

// Extract token from request headers
export const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

// Middleware to check if user is authenticated
export const isAuthenticated = (token) => {
  return !!verifyToken(token);
};

// Middleware to check if user is admin
export const isAdmin = (token) => {
  const decoded = verifyToken(token);
  return decoded && decoded.role === 'admin';
};
