export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  liveUrl?: string;
  reviews: Review[];
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  status: 'online' | 'offline';
  serviceTypes: string[];
  bio: string;
  availability: string;
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
  messages: Message[];
}

export interface MockStore {
  products: Product[];
  specialists: Specialist[];
  orders: Order[];
}

export const initialMockStore: MockStore = {
  products: [
    {
      id: 'kwetu-business-website',
      title: 'Kwetu Business Website',
      description: 'A polished business website built to showcase services, improve trust, and convert visitors into leads.',
      imageUrl: 'https://picsum.photos/seed/kwetu-business-site/800/800',
      category: 'Websites',
      liveUrl: 'https://example.com/kwetu-business-site',
      averageRating: 4.9,
      reviewCount: 18,
      createdAt: '2026-05-17T13:00:00.000Z',
      reviews: [
        {
          id: 'review-1',
          userId: 'demo-user',
          userName: 'Amina',
          rating: 5,
          comment: 'Clear layout, strong branding, and a very professional result.',
          createdAt: '2026-05-17T13:05:00.000Z',
        },
        {
          id: 'review-2',
          userId: 'client-rose',
          userName: 'Rose Njeri',
          rating: 5,
          comment: 'The website feels premium and our customers immediately trusted the brand more.',
          createdAt: '2026-05-17T13:20:00.000Z',
        },
      ],
    },
    {
      id: 'restaurant-ordering-landing-page',
      title: 'Restaurant Ordering Landing Page',
      description: 'A modern restaurant landing page with promotional sections, menu highlights, and WhatsApp ordering flow.',
      imageUrl: 'https://picsum.photos/seed/restaurant-site/800/800',
      category: 'Websites',
      liveUrl: 'https://example.com/restaurant-ordering',
      averageRating: 4.8,
      reviewCount: 13,
      createdAt: '2026-05-16T12:00:00.000Z',
      reviews: [
        {
          id: 'review-3',
          userId: 'client-dennis',
          userName: 'Dennis Otieno',
          rating: 5,
          comment: 'The landing page made online orders much easier and the overall flow is very polished.',
          createdAt: '2026-05-16T12:30:00.000Z',
        },
      ],
    },
    {
      id: 'corporate-brand-identity-kit',
      title: 'Corporate Brand Identity Kit',
      description: 'A clean identity system covering logo usage, stationery, brand colors, and marketing layouts for a growing company.',
      imageUrl: 'https://picsum.photos/seed/brand-identity-kit/800/800',
      category: 'Branding',
      averageRating: 4.9,
      reviewCount: 11,
      createdAt: '2026-05-15T11:00:00.000Z',
      reviews: [
        {
          id: 'review-4',
          userId: 'client-linet',
          userName: 'Linet Wambui',
          rating: 4,
          comment: 'Our social media campaign looked consistent across every platform and felt professionally done.',
          createdAt: '2026-05-13T11:10:00.000Z',
        },
      ],
    },
    {
      id: 'ecommerce-storefront-redesign',
      title: 'E-commerce Storefront Redesign',
      description: 'A refreshed storefront experience focused on product discovery, trust elements, and mobile-first shopping.',
      imageUrl: 'https://picsum.photos/seed/storefront-redesign/800/800',
      category: 'Websites',
      liveUrl: 'https://example.com/storefront-redesign',
      averageRating: 5,
      reviewCount: 22,
      createdAt: '2026-05-14T10:00:00.000Z',
      reviews: [],
    },
    {
      id: 'social-campaign-design-suite',
      title: 'Social Campaign Design Suite',
      description: 'A bundle of coordinated campaign visuals for Instagram, Facebook, and status ads with a consistent conversion-focused style.',
      imageUrl: 'https://picsum.photos/seed/social-campaign-suite/800/800',
      category: 'Social Media',
      averageRating: 4.7,
      reviewCount: 16,
      createdAt: '2026-05-13T09:00:00.000Z',
      reviews: [],
    },
    {
      id: 'customer-support-ai-assistant',
      title: 'Customer Support AI Assistant',
      description: 'An AI support flow designed to answer FAQs, qualify leads, and route customer requests quickly.',
      imageUrl: 'https://picsum.photos/seed/support-ai-assistant/800/800',
      category: 'Automation',
      liveUrl: 'https://example.com/support-ai-assistant',
      averageRating: 4.8,
      reviewCount: 9,
      createdAt: '2026-05-12T08:00:00.000Z',
      reviews: [],
    },
    {
      id: 'modern-corporate-flyer',
      title: 'Modern Corporate Flyer',
      description: 'A clean and professional flyer layout for corporate events, launches, and service promotions.',
      imageUrl: 'https://picsum.photos/seed/flyer1/800/800',
      category: 'Print Design',
      averageRating: 4.8,
      reviewCount: 12,
      createdAt: '2026-05-11T07:00:00.000Z',
      reviews: [],
    },
    {
      id: 'minimalist-logo-system',
      title: 'Minimalist Logo System',
      description: 'A minimalist logo direction with clear lockups and practical variations for web, print, and packaging.',
      imageUrl: 'https://picsum.photos/seed/logo1/800/800',
      category: 'Branding',
      averageRating: 5,
      reviewCount: 8,
      createdAt: '2026-05-10T06:00:00.000Z',
      reviews: [],
    },
    {
      id: 'portfolio-website-for-creative-founder',
      title: 'Portfolio Website for Creative Founder',
      description: 'A personal brand website designed to present case studies, social proof, and inquiry channels elegantly.',
      imageUrl: 'https://picsum.photos/seed/portfolio-founder/800/800',
      category: 'Websites',
      liveUrl: 'https://example.com/creative-founder',
      averageRating: 4.9,
      reviewCount: 14,
      createdAt: '2026-05-09T05:00:00.000Z',
      reviews: [],
    },
    {
      id: 'event-poster-collection',
      title: 'Event Poster Collection',
      description: 'A bold event poster series crafted for youth events, conferences, and community activations.',
      imageUrl: 'https://picsum.photos/seed/event-posters/800/800',
      category: 'Print Design',
      averageRating: 4.6,
      reviewCount: 10,
      createdAt: '2026-05-08T04:00:00.000Z',
      reviews: [],
    },
  ],
  specialists: [
    {
      id: 'specialist-grace',
      name: 'Grace Wanjiku',
      title: 'Brand & Graphics Specialist',
      phone: '+254 711 245 890',
      email: 'grace@kwetu.local',
      status: 'online',
      serviceTypes: ['Poster', 'Logo'],
      bio: 'Grace focuses on visual identity, campaign graphics, posters, and polished brand assets for growing businesses.',
      availability: 'Mon-Fri, 9am-5pm',
    },
    {
      id: 'specialist-daniel',
      name: 'Daniel Mutua',
      title: 'Web Solutions Specialist',
      phone: '+254 722 468 133',
      email: 'daniel@kwetu.local',
      status: 'online',
      serviceTypes: ['Website'],
      bio: 'Daniel handles landing pages, business websites, and conversion-focused web experiences.',
      availability: 'Mon-Sat, 8am-6pm',
    },
    {
      id: 'specialist-aisha',
      name: 'Aisha Noor',
      title: 'AI Automation Specialist',
      phone: '+254 734 802 511',
      email: 'aisha@kwetu.local',
      status: 'offline',
      serviceTypes: ['AI Automation', 'Voice Assistant'],
      bio: 'Aisha designs AI assistants, workflow automation, and conversational customer support systems.',
      availability: 'Mon-Fri, 10am-6pm',
    }
  ],
  orders: [],
};
