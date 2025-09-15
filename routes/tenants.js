import express from 'express';
import Tenant from '../models/tenant.js';
import User from '../models/user.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/tenants/register
// Public: registers a tenant and creates initial Admin user
// body: { name, slug, adminEmail, adminName, password? }
router.post('/register', async (req, res) => {
  try {
    const { name, slug, adminEmail, adminName, password } = req.body;
    if (!name || !slug || !adminEmail) return res.status(400).json({ message: 'name, slug and adminEmail are required' });

    const existing = await Tenant.findOne({ slug: slug.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Tenant slug already taken' });

    const tenant = new Tenant({ name, slug: slug.toLowerCase() });
    await tenant.save();

    const user = new User({ name: adminName || 'Admin', email: adminEmail.toLowerCase(), password: password || 'password', role: 'Admin', tenant: tenant._id });
    await user.save();

    res.status(201).json({ tenant: { slug: tenant.slug, name: tenant.name }, admin: { email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tenants/:slug/invite  (Admin only)
// body: { email, name, role? }
router.post('/:slug/invite', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    const { slug } = req.params;
    if (req.tenant.slug !== slug) return res.status(403).json({ message: 'Cannot invite for another tenant' });

    const { email, name, role = 'Member' } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email: email.toLowerCase(), password: 'password', role, tenant: req.tenant._id });
    await user.save();

    res.status(201).json({ message: 'Invited', user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tenants/:slug/upgrade  (Admin only)
router.post('/:slug/upgrade', authMiddleware, requireRole('Admin'), async (req, res) => {
  try {
    const { slug } = req.params;
    if (req.tenant.slug !== slug) return res.status(403).json({ message: 'Cannot upgrade another tenant' });

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    tenant.plan = 'pro';
    await tenant.save();

    res.json({ message: 'Upgraded to pro', tenant: { slug: tenant.slug, plan: tenant.plan } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;