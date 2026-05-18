import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Kwetu API is running.' });
});

router.get('/health', (req, res) => {
  res.send({
    status: 'ok',
    database: {
      readyState: process.env.MONGODB_URI ? 'configured' : 'missing',
      dbName: process.env.MONGODB_DB || 'kwetu_creations',
    },
  });
});

export default router;
