import express from 'express';
import { Order } from '../models/index.js';
import { requireAuth } from '../lib/auth.js';
import { findSpecialistForService } from '../lib/order-helpers.js';
import { formatMessage, formatOrder } from '../lib/serializers.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const filters = req.auth.user.role === 'admin' ? {} : { client: req.auth.user._id };
  const orders = await Order.find(filters)
    .populate('client', 'displayName email role')
    .populate('specialist', 'name title status');
  res.send(orders.map(formatOrder));
});

router.get('/:orderId', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('client', 'displayName email role')
    .populate('specialist', 'name title status');

  if (!order) {
    res.status(404).send({ message: 'Order not found.' });
    return;
  }

  if (req.auth.user.role !== 'admin' && order.client._id.toString() !== req.auth.user._id.toString()) {
    res.status(403).send({ message: 'You do not have access to this order.' });
    return;
  }

  res.send(formatOrder(order));
});

router.post('/', requireAuth, async (req, res) => {
  const { clientName, designType, requirements, status, paymentStatus, amount, firstMessage } = req.body;
  const authUser = req.auth.user;

  if (!clientName || !designType || amount == null) {
    res.status(400).send({ message: 'Missing required order fields.' });
    return;
  }

  const specialist = await findSpecialistForService(designType);

  if (!specialist) {
    res.status(404).send({ message: 'No specialist available for this service.' });
    return;
  }

  const order = await Order.create({
    client: authUser._id,
    clientName,
    designType,
    specialist: specialist._id,
    requirements: requirements || {},
    status: status || 'pending',
    paymentStatus: paymentStatus || 'unpaid',
    amount,
    messages: firstMessage
      ? [
          {
            sender: authUser._id,
            senderName: firstMessage?.senderName || authUser.displayName || clientName,
            senderRole: 'client',
            content: firstMessage.content,
            status: specialist.status === 'online' ? 'delivered' : 'sent',
          },
        ]
      : [],
  });

  const populatedOrder = await Order.findById(order._id)
    .populate('client', 'displayName email role')
    .populate('specialist', 'name title status');

  res.status(201).send(formatOrder(populatedOrder));
});

router.post('/:orderId/messages', requireAuth, async (req, res) => {
  const { content, senderRole } = req.body;
  const order = await Order.findById(req.params.orderId).populate('specialist');
  const authUser = req.auth.user;

  if (!order) {
    res.status(404).send({ message: 'Order not found.' });
    return;
  }

  if (req.auth.user.role !== 'admin' && order.client.toString() !== authUser._id.toString()) {
    res.status(403).send({ message: 'You do not have access to this order.' });
    return;
  }

  if (!content?.trim()) {
    res.status(400).send({ message: 'Message content is required.' });
    return;
  }

  order.messages.push({
    sender: authUser._id,
    senderName: authUser.displayName,
    senderRole: senderRole || 'client',
    content: content.trim(),
    status: order.specialist?.status === 'online' ? 'delivered' : 'sent',
  });

  await order.save();

  res.status(201).send(formatMessage(order.messages[order.messages.length - 1]));
});

router.patch('/:orderId/payment', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('client', 'displayName email role')
    .populate('specialist', 'name title status');

  if (!order) {
    res.status(404).send({ message: 'Order not found.' });
    return;
  }

  if (req.auth.user.role !== 'admin' && order.client._id.toString() !== req.auth.user._id.toString()) {
    res.status(403).send({ message: 'You do not have access to this order.' });
    return;
  }

  order.paymentStatus = 'paid';
  order.messages.push({
    sender: null,
    senderName: 'Kwetu Bot',
    senderRole: 'system',
    content: 'Payment confirmed! Our team has been notified and will start working on your design immediately.',
    status: 'read',
    readAt: new Date(),
  });

  await order.save();

  res.send(formatOrder(order));
});

export default router;
