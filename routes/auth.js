import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '7d';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).populate('tenant');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id.toString(), tenantId: user.tenant._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({ token, user: user.toSafeObject(), tenant: { slug: user.tenant.slug, plan: user.tenant.plan } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;