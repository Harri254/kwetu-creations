import express from 'express';
import { Specialist } from '../models/index.js';
import { findSpecialistForService } from '../lib/order-helpers.js';
import { formatSpecialist } from '../lib/serializers.js';

const router = express.Router();

router.get('/by-service/:serviceType', async (req, res) => {
  const specialist = await findSpecialistForService(req.params.serviceType);

  if (!specialist) {
    res.status(404).send({ message: 'No specialist found for this service.' });
    return;
  }

  res.send(formatSpecialist(specialist));
});

router.get('/:specialistId', async (req, res) => {
  const specialist = await Specialist.findById(req.params.specialistId);

  if (!specialist) {
    res.status(404).send({ message: 'Specialist not found.' });
    return;
  }

  res.send(formatSpecialist(specialist));
});

export default router;
