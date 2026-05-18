export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  role: 'client' | 'specialist' | 'admin';
}

export interface Review {
  id: string;
  userId: string | null;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug?: string;
  description: string;
  imageUrl: string;
  category: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt?: string;
  liveUrl?: string | null;
  reviews: Review[];
}

export interface Message {
  id: string;
  orderId?: string;
  senderId: string;
  senderName: string;
  senderRole?: 'client' | 'specialist' | 'system';
  content: string;
  status?: 'sent' | 'delivered' | 'read';
  readAt?: string | null;
  timestamp: string;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  status: 'online' | 'offline';
  availability?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceRequirementField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  required: boolean;
  placeholder?: string | null;
  options?: string[];
}

export interface Service {
  id: string;
  serviceType: 'Poster' | 'Logo' | 'Website' | 'AI Automation' | 'Voice Assistant';
  slug: string;
  title: string;
  description: string;
  icon: string;
  basePrice: number;
  isActive: boolean;
  requirementFields: ServiceRequirementField[];
}

export interface Order {
  id: string;
  userId: string;
  clientName: string;
  designType: string;
  specialistId: string;
  status: string;
  paymentStatus: string;
  amount: number;
  requirements: Record<string, string>;
  createdAt: string;
  updatedAt?: string;
  messages: Message[];
}
