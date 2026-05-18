import { api } from './api';
import type { Message, Order, Product, Review, Service, Specialist } from '../data/mockdata';

export async function getProducts(): Promise<Product[]> {
  return api.getProducts();
}

export async function getProductById(productId: string): Promise<Product | null> {
  return api.getProductById(productId);
}

export async function addReviewToProduct(
  productId: string,
  review: Omit<Review, 'id' | 'createdAt'>,
): Promise<Review> {
  return api.addReviewToProduct(productId, {
    rating: review.rating,
    comment: review.comment,
  });
}

export async function getServices(): Promise<Service[]> {
  return api.getServices();
}

export async function createOrder(
  input: Omit<Order, 'id' | 'createdAt' | 'messages'>,
  firstMessage: Omit<Message, 'id' | 'timestamp'>,
): Promise<Order> {
  return api.createOrder({
    clientName: input.clientName,
    designType: input.designType,
    requirements: input.requirements,
    status: input.status,
    paymentStatus: input.paymentStatus,
    amount: input.amount,
    firstMessage: {
      senderName: firstMessage.senderName,
      content: firstMessage.content,
    },
  });
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  return api.getOrderById(orderId);
}

export async function getSpecialistById(specialistId: string): Promise<Specialist | null> {
  return api.getSpecialistById(specialistId);
}

export async function getSpecialistForService(serviceType: string): Promise<Specialist | null> {
  return api.getSpecialistForService(serviceType);
}

export async function addMessageToOrder(
  orderId: string,
  input: Omit<Message, 'id' | 'timestamp'>,
): Promise<Message> {
  return api.addMessageToOrder(orderId, {
    content: input.content,
    senderRole: input.senderRole,
  });
}

export async function markOrderPaid(orderId: string): Promise<Order> {
  return api.markOrderPaid(orderId);
}
