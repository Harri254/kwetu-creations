import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from '../db.js';
import { Order, Product, Service, Specialist } from '../models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mockDataPath = path.resolve(__dirname, '../mockdata.json');

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function prepareProducts(products = []) {
  return products.map((product) => ({
    ...product,
    slug: product.slug || slugify(product.title),
    reviews: (product.reviews || []).map((review) => ({
      user: null,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    })),
  }));
}

async function seedCollection(Model, records, label) {
  if (!records?.length) {
    console.log(`No ${label} records found in mockdata.`);
    return;
  }

  await Model.deleteMany({});
  await Model.insertMany(records, { ordered: true });
  console.log(`Seeded ${records.length} ${label}.`);
}

async function seedDatabase() {
  await connectToDatabase();

  const raw = await fs.readFile(mockDataPath, 'utf-8');
  const mockData = JSON.parse(raw);

  await seedCollection(Product, prepareProducts(mockData.products), 'products');
  await seedCollection(Specialist, mockData.specialists, 'specialists');
  await seedCollection(Service, mockData.services, 'services');
  await seedCollection(Order, mockData.orders, 'orders');

  console.log('Database seeding complete.');
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });
