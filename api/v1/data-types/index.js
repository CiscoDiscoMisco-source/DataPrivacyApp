import { authenticateToken } from '../../middleware';

// Mock data for demonstration
const DATA_TYPES = [
  { id: 1, name: 'Personal Information', description: 'Name, address, phone number, etc.' },
  { id: 2, name: 'Financial Information', description: 'Credit card details, bank accounts, etc.' },
  { id: 3, name: 'Medical Records', description: 'Health information, medical history, etc.' },
  { id: 4, name: 'Location Data', description: 'GPS coordinates, check-ins, etc.' },
  { id: 5, name: 'Online Activity', description: 'Browsing history, search queries, etc.' }
];

export default function handler(req, res) {
  // Handle GET request
  if (req.method === 'GET') {
    const user = authenticateToken(req);
    
    // Check authentication
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    // Return data types
    return res.status(200).json({
      data_types: DATA_TYPES
    });
  }
  
  // Handle unsupported methods
  return res.status(405).json({
    error: 'Method Not Allowed',
    message: `Method ${req.method} is not supported for this endpoint`
  });
} 