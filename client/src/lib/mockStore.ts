import { initialMockStore, type Message, type MockStore, type Order, type Product, type Review, type Specialist } from '../data/mockdata';

const STORAGE_KEY = 'kwetu-mock-store';

function cloneStore(store: MockStore): MockStore {
  return JSON.parse(JSON.stringify(store)) as MockStore;
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function migrateStore(store: Partial<MockStore>): MockStore {
  const seeded = cloneStore(initialMockStore);

  return {
    products: (store.products ?? seeded.products).map((product) => ({
      ...product,
      reviews: product.reviews ?? [],
    })),
    specialists: store.specialists ?? seeded.specialists,
    orders: (store.orders ?? []).map((order) => ({
      ...order,
      specialistId: order.specialistId ?? '',
      messages: order.messages ?? [],
    })),
  };
}

export function readStore(): MockStore {
  if (typeof window === 'undefined') {
    return cloneStore(initialMockStore);
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const seeded = cloneStore(initialMockStore);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  const migrated = migrateStore(JSON.parse(existing) as Partial<MockStore>);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  return migrated;
}

export function writeStore(store: MockStore) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function getProducts() {
  const store = readStore();
  return store.products.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function getProductById(productId: string) {
  const store = readStore();
  return store.products.find((product) => product.id === productId) ?? null;
}

export async function addReviewToProduct(productId: string, review: Omit<Review, 'id' | 'createdAt'>) {
  const store = readStore();
  const product = store.products.find((item) => item.id === productId);
  if (!product) throw new Error('Product not found');

  const nextReview: Review = {
    ...review,
    id: createId('review'),
    createdAt: new Date().toISOString(),
  };

  product.reviews.unshift(nextReview);
  product.reviewCount = product.reviews.length;
  product.averageRating =
    product.reviews.reduce((sum, item) => sum + item.rating, 0) / product.reviews.length;
  writeStore(store);
  return nextReview;
}

export async function createOrder(input: Omit<Order, 'id' | 'createdAt' | 'messages'>, firstMessage: Omit<Message, 'id' | 'timestamp'>) {
  const store = readStore();
  const orderId = createId('order');
  const message: Message = {
    ...firstMessage,
    orderId,
    id: createId('message'),
    timestamp: new Date().toISOString(),
  };

  const order: Order = {
    ...input,
    id: orderId,
    createdAt: new Date().toISOString(),
    messages: [message],
  };

  store.orders.unshift(order);
  writeStore(store);
  return order;
}

export async function getOrderById(orderId: string) {
  const store = readStore();
  return store.orders.find((order) => order.id === orderId) ?? null;
}

export async function getSpecialists() {
  const store = readStore();
  return store.specialists;
}

export async function getSpecialistById(specialistId: string) {
  const store = readStore();
  return store.specialists.find((specialist) => specialist.id === specialistId) ?? null;
}

export async function getSpecialistForService(serviceType: string): Promise<Specialist | null> {
  const store = readStore();
  return store.specialists.find((specialist) => specialist.serviceTypes.includes(serviceType)) ?? null;
}

export async function addMessageToOrder(orderId: string, input: Omit<Message, 'id' | 'timestamp'>) {
  const store = readStore();
  const order = store.orders.find((item) => item.id === orderId);
  if (!order) throw new Error('Order not found');

  const message: Message = {
    ...input,
    id: createId('message'),
    timestamp: new Date().toISOString(),
  };

  order.messages.push(message);
  writeStore(store);
  return message;
}

export async function markOrderPaid(orderId: string) {
  const store = readStore();
  const order = store.orders.find((item) => item.id === orderId);
  if (!order) throw new Error('Order not found');
  order.paymentStatus = 'paid';
  writeStore(store);
  return order;
}
