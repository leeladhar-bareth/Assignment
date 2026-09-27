import Session from '../models/Session.js';

// middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // get signed cookie
    const sessionId = req.signedCookies?.sessionId;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in.',
      });
    }

    // find session in db
    const session = await Session.findOne({ sessionId }).populate('user');

    if (!session || !session.user) {
      res.clearCookie('sessionId');
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid. Please log in again.',
      });
    }

    // attach user to request
    req.user = session.user;
    req.sessionId = sessionId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
