import express from 'express';
import { User } from '../models/index.js';
import { requireAuth, requireRole } from '../lib/auth.js';
import { formatUser } from '../lib/serializers.js';

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const users = await User.find({}).select('-passwordHash');
  res.send(users.map(formatUser));
});

export default router;
