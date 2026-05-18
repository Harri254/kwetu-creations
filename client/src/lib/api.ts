import type { Order, Product, Review, Service, Specialist, User, Message } from '../data/mockdata';

const API_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL ||
  'http://localhost:3001/api';
const AUTH_TOKEN_KEY = 'kwetu-auth-token';

interface AuthResponse {
  token: string;
  user: User;
}

function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(errorBody.message || 'Request failed.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getStoredToken: getAuthToken,
  setStoredToken: (token: string) => window.localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearStoredToken: () => window.localStorage.removeItem(AUTH_TOKEN_KEY),
  loginWithEmail: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerWithEmail: (input: { firstName: string; lastName: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  getCurrentUser: () => request<User>('/auth/me'),
  logout: () =>
    request<void>('/auth/logout', {
      method: 'POST',
    }),
  getProducts: () => request<Product[]>('/products'),
  getProductById: (productId: string) => request<Product>(`/products/${productId}`),
  addReviewToProduct: (
    productId: string,
    review: { rating: number; comment: string },
  ) =>
    request<Review>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),
  getServices: () => request<Service[]>('/services'),
  getSpecialistById: (specialistId: string) => request<Specialist>(`/specialists/${specialistId}`),
  getSpecialistForService: (serviceType: string) =>
    request<Specialist>(`/specialists/by-service/${encodeURIComponent(serviceType)}`),
  getOrderById: (orderId: string) => request<Order>(`/orders/${orderId}`),
  createOrder: (payload: {
    clientName: string;
    designType: string;
    requirements: Record<string, string>;
    status: string;
    paymentStatus: string;
    amount: number;
    firstMessage?: { senderName: string; content: string };
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  addMessageToOrder: (
    orderId: string,
    payload: { content: string; senderRole?: string },
  ) =>
    request<Message>(`/orders/${orderId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  markOrderPaid: (orderId: string) =>
    request<Order>(`/orders/${orderId}/payment`, {
      method: 'PATCH',
    }),
};
