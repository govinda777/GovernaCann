const jwt = require('jsonwebtoken');

/**
 * Middleware for handling user authorization.
 * Uses jsonwebtoken to verify the token and extract context.
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // In production, process.env.JWT_SECRET or Privy's JWKS endpoint would be used.
    // For this example we use a mock secret if not provided in the environment.
    const secret = process.env.JWT_SECRET || 'mock_secret';
    const decodedUser = jwt.verify(token, secret);

    // We expect the token payload to include id, role, and associationId
    if (!decodedUser.id || !decodedUser.role || !decodedUser.associationId) {
      throw new Error("Token payload missing required context fields");
    }

    // Attach user to the request so subsequent routes can use their context
    req.user = decodedUser;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware to enforce role-based access.
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

module.exports = {
    requireAuth,
    requireRole
};
