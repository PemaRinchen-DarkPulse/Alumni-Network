const jwt = require('jsonwebtoken');

exports.authenticateJWT = async (req, res, next) => {
  // Log detailed request info for debugging
  console.log('===== Auth Middleware =====');
  console.log('Request path:', req.originalUrl);
  console.log('Request method:', req.method);
  console.log('Request content-type:', req.header('Content-Type'));
  console.log('Authentication Headers:', {
    auth: req.header('Authorization'),
    xAuth: req.header('x-auth-token')
  });
  
  // Get token from header (support both formats)
  let token = req.header('x-auth-token') || req.header('Authorization');
  
  // Check if using Bearer format
  if (token && token.startsWith('Bearer ')) {
    console.log('Bearer token found, extracting...');
    token = token.slice(7);
  } else {
    console.log('Token format:', token ? 'non-Bearer token' : 'no token');
  }

  // Check if no token
  if (!token) {
    console.log('⚠️ No authentication token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  console.log('Token received, length:', token.length);
  console.log('Token preview:', token.substring(0, 10) + '...' + token.substring(token.length - 5));
  try {
    // Verify token with algorithm specified explicitly for security
    // Try with issuer/audience first, fallback to basic verification for compatibility
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { 
        algorithms: ['HS256'],
        issuer: 'alumni-network-api',
        audience: 'alumni-network-client'
      });
    } catch (verifyError) {
      // Fallback to basic verification for older tokens
      console.log('Trying fallback token verification...');
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    }
    
    // Add user info from payload
    req.user = decoded;
    
    // Check if role is in the token
    if (decoded.role) {
      console.log('User role from token:', decoded.role);
      next();
    } else {
      // For backward compatibility: Fetch role from database if not in token
      console.log('Role not found in token, fetching from database...');
      const User = require('../models/userModel');
      
      // Use async/await pattern with try/catch
      try {
        const user = await User.findById(decoded.id).select('role');
        if (!user) {
          console.error('User not found in database:', decoded.id);
          return res.status(401).json({ message: 'User not found' });
        }
        
        // Add role to req.user
        req.user.role = user.role;
        console.log('User role from database:', user.role);
        
        next();
      } catch (dbError) {
        console.error('Database error when fetching user role:', dbError);
        return res.status(500).json({ message: 'Server error when processing authentication' });
      }
    }
  } catch (err) {
    console.error('Token verification error:', err.message);
    console.error('Token:', token?.substring(0, 20) + '...');
    res.status(401).json({ message: 'Token is not valid' });
  }
};
