import jwt from 'jsonwebtoken';

// In a real app, this would use a database
// Simple mock data for demo purposes
const MOCK_USERS = [
  { id: 1, email: 'admin@example.com', password: 'admin123', isAdmin: true, name: 'Admin User' },
  { id: 2, email: 'user@example.com', password: 'user123', isAdmin: false, name: 'Regular User' }
];

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Find user
    const user = MOCK_USERS.find(u => u.email === email);
    
    // Check user and password
    if (!user || user.password !== password) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }
    
    // Create token
    const secret = process.env.JWT_SECRET_KEY || 'default_jwt_secret_for_development';
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin 
      },
      secret,
      { expiresIn: '24h' }
    );
    
    // Return token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred during login'
    });
  }
} 