import express from 'express';
import Note from '../models/note.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper: check free plan limit reached
async function isNoteLimitReached(tenant) {
  if (!tenant) return true; // defensive
  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenant: tenant._id });
    return count >= 3; // true if reached
  }
  return false;
}

// POST /api/notes
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });

    const limitReached = await isNoteLimitReached(req.tenant);
    if (limitReached) return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro to create more notes.' });

    const note = new Note({ title, content: content || '', tenant: req.tenant._id, owner: req.user._id });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.tenant._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/notes/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.tenant._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/notes/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenant: req.tenant._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    const { title, content } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenant: req.tenant._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;