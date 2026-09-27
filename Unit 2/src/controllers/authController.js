import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import Session from '../models/Session.js';

const MAX_SESSIONS = 2;

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // check if email already used
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// Login - create session (max 2 devices)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // get all sessions of this user (oldest first)
    const sessions = await Session.find({ user: user._id }).sort({ createdAt: 1 });

    // if already 2 sessions, remove the oldest one
    if (sessions.length >= MAX_SESSIONS) {
      await Session.deleteOne({ _id: sessions[0]._id });
    }

    // create new session
    const sessionId = uuidv4();
    await Session.create({
      sessionId,
      user: user._id,
      userAgent: req.headers['user-agent'] || '',
    });

    // set signed cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// logout from current device
export const logout = async (req, res) => {
  try {
    if (req.sessionId) {
      await Session.deleteOne({ sessionId: req.sessionId });
    }

    res.clearCookie('sessionId', {
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully from this device',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
    });
  }
};

// logout from all devices
export const logoutAll = async (req, res) => {
  try {
    await Session.deleteMany({ user: req.user._id });

    res.clearCookie('sessionId', {
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully from all devices',
    });
  } catch (error) {
    console.error('Logout-all error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout-all',
    });
  }
};

// get current logged in user
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};
