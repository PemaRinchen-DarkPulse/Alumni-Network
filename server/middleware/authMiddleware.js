const jwt = require('jsonwebtoken');

exports.authenticateJWT = (req, res, next) => {
  // Get token from header (support both formats)
  let token = req.header('x-auth-token') || req.header('Authorization');
  
  // Check if using Bearer format
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token with algorithm specified explicitly for security
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
