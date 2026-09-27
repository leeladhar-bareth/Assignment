import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notes API is running',
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB',
      });
    }
  }

  if (err.message && err.message.includes('Only images')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

export default app;
