const jwt = require('jsonwebtoken');

/**
 * Protect routes - only authenticated users
 */
const protect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

/**
 * Role-based access control
 */
const roleGuard = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

/**
 * Multi-tenant isolation guard
 */
const tenantGuard = (req, res, next) => {
  if (req.user.role !== 'super_admin' && !req.user.company_id) {
    return res.status(403).json({ message: 'Company identification failed' });
  }
  next();
};

module.exports = { protect, authenticateToken: protect, roleGuard, tenantGuard };
