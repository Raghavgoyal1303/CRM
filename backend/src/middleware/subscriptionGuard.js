const db = require('../config/db');

/**
 * Subscription Guard Middleware
 * Blocks access if the tenant's subscription is not active or trialing.
 */
const subscriptionGuard = async (req, res, next) => {
  // Superadmins bypass subscription checks
  if (req.user.role === 'superadmin') return next();

  if (!req.companyId) {
    return res.status(403).json({ message: 'No company context' });
  }

  try {
    const { rows: companies } = await db.query(
      'SELECT subscription_status FROM companies WHERE id = ?',
      [req.companyId]
    );

    if (companies.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const { subscription_status } = companies[0];

    if (subscription_status === 'suspended' || subscription_status === 'cancelled') {
      return res.status(402).json({ 
        message: 'Subscription Suspended', 
        status: subscription_status,
        code: 'SUBSCRIPTION_EXPIRED'
      });
    }

    next();
  } catch (err) {
    console.error('Subscription Guard Error:', err);
    res.status(500).json({ message: 'Internal Server Error during subscription check' });
  }
};

module.exports = subscriptionGuard;
