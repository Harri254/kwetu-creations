import express from 'express';
import { Product } from '../models/index.js';
import { requireAuth } from '../lib/auth.js';
import { formatProduct, formatReview } from '../lib/serializers.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.send(products.map(formatProduct));
});

router.get('/:productId', async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404).send({ message: 'Product not found.' });
    return;
  }

  res.send(formatProduct(product));
});

router.post('/:productId/reviews', requireAuth, async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  const authUser = req.auth.user;

  if (!product) {
    res.status(404).send({ message: 'Product not found.' });
    return;
  }

  if (!rating || !comment?.trim()) {
    res.status(400).send({ message: 'Rating and comment are required.' });
    return;
  }

  product.reviews.unshift({
    user: authUser._id,
    userName: authUser.displayName,
    rating,
    comment: comment.trim(),
  });

  product.reviewCount = product.reviews.length;
  product.averageRating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

  await product.save();

  res.status(201).send(formatReview(product.reviews[0]));
});

export default router;
