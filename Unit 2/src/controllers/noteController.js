import Note from '../models/Note.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// helper to upload file buffer to cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'notes-attachments',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

// get all notes of logged in user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notes',
    });
  }
};

// get single note
export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('Get note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching note',
    });
  }
};

// create note (with optional attachment)
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    let attachment = { url: null, publicId: null };

    // if file is uploaded
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        attachment = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload attachment',
        });
      }
    }

    const note = await Note.create({
      title,
      content,
      user: req.user._id,
      attachment,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating note',
    });
  }
};

// update note
export const updateNote = async (req, res) => {
  try {
    let note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    const { title, content } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    // if new file uploaded, replace old one
    if (req.file) {
      if (note.attachment?.publicId) {
        try {
          await cloudinary.uploader.destroy(note.attachment.publicId);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }

      try {
        const result = await uploadToCloudinary(req.file.buffer);
        note.attachment = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload new attachment',
        });
      }
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating note',
    });
  }
};

// delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    // delete file from cloudinary if exists
    if (note.attachment?.publicId) {
      try {
        await cloudinary.uploader.destroy(note.attachment.publicId);
      } catch (err) {
        console.error('Error deleting cloudinary file:', err);
      }
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting note',
    });
  }
};
