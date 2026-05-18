import express from 'express';
import { Service } from '../models/index.js';
import { formatService } from '../lib/serializers.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ basePrice: 1 });
  res.send(services.map(formatService));
});

export default router;
