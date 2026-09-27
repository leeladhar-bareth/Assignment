import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All note routes are protected
router.use(protect);

router
  .route('/')
  .get(getNotes)
  .post(upload.single('attachment'), createNote);

router
  .route('/:id')
  .get(getNote)
  .put(upload.single('attachment'), updateNote)
  .delete(deleteNote);

export default router;
