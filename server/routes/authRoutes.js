import express from 'express';
import { User } from '../models/index.js';
import {
  formatAuthResponse,
  hashPassword,
  requireAuth,
  verifyPassword,
} from '../lib/auth.js';
import { formatUser } from '../lib/serializers.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).send({ message: 'First name, last name, email, and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409).send({ message: 'An account with this email already exists.' });
    return;
  }

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role: 'client',
  });

  res.status(201).send(formatAuthResponse(user));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Email and password are required.' });
    return;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).send({ message: 'Invalid email or password.' });
    return;
  }

  res.send(formatAuthResponse(user));
});

router.get('/me', requireAuth, async (req, res) => {
  res.send(formatUser(req.auth.user));
});

router.post('/logout', requireAuth, async (req, res) => {
  res.status(204).send();
});

export default router;
