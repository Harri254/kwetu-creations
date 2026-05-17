import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Layout, Zap, MessageSquare, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: any;
  liveUrl?: string;
}

const SHOWCASE_PROJECTS = [
  {
    title: 'Kwetu Business Website',
    description: 'A polished business website built to showcase services, improve trust, and convert visitors into leads.',
    imageUrl: 'https://picsum.photos/seed/kwetu-business-site/800/800',
    category: 'Websites',
    liveUrl: 'https://example.com/kwetu-business-site',
    averageRating: 4.9,
    reviewCount: 18,
  },
  {
    title: 'Restaurant Ordering Landing Page',
    description: 'A modern restaurant landing page with promotional sections, menu highlights, and WhatsApp ordering flow.',
    imageUrl: 'https://picsum.photos/seed/restaurant-site/800/800',
    category: 'Websites',
    liveUrl: 'https://example.com/restaurant-ordering',
    averageRating: 4.8,
    reviewCount: 13,
  },
  {
    title: 'Corporate Brand Identity Kit',
    description: 'A clean identity system covering logo usage, stationery, brand colors, and marketing layouts for a growing company.',
    imageUrl: 'https://picsum.photos/seed/brand-identity-kit/800/800',
    category: 'Branding',
    averageRating: 4.9,
    reviewCount: 11,
  },
  {
    title: 'E-commerce Storefront Redesign',
    description: 'A refreshed storefront experience focused on product discovery, trust elements, and mobile-first shopping.',
    imageUrl: 'https://picsum.photos/seed/storefront-redesign/800/800',
    category: 'Websites',
    liveUrl: 'https://example.com/storefront-redesign',
    averageRating: 5,
    reviewCount: 22,
  },
  {
    title: 'Social Campaign Design Suite',
    description: 'A bundle of coordinated campaign visuals for Instagram, Facebook, and status ads with a consistent conversion-focused style.',
    imageUrl: 'https://picsum.photos/seed/social-campaign-suite/800/800',
    category: 'Social Media',
    averageRating: 4.7,
    reviewCount: 16,
  },
  {
    title: 'Customer Support AI Assistant',
    description: 'An AI support flow designed to answer FAQs, qualify leads, and route customer requests quickly.',
    imageUrl: 'https://picsum.photos/seed/support-ai-assistant/800/800',
    category: 'Automation',
    liveUrl: 'https://example.com/support-ai-assistant',
    averageRating: 4.8,
    reviewCount: 9,
  },
  {
    title: 'Modern Corporate Flyer',
    description: 'A clean and professional flyer layout for corporate events, launches, and service promotions.',
    imageUrl: 'https://picsum.photos/seed/flyer1/800/800',
    category: 'Print Design',
    averageRating: 4.8,
    reviewCount: 12,
  },
  {
    title: 'Minimalist Logo System',
    description: 'A minimalist logo direction with clear lockups and practical variations for web, print, and packaging.',
    imageUrl: 'https://picsum.photos/seed/logo1/800/800',
    category: 'Branding',
    averageRating: 5,
    reviewCount: 8,
  },
  {
    title: 'Portfolio Website for Creative Founder',
    description: 'A personal brand website designed to present case studies, social proof, and inquiry channels elegantly.',
    imageUrl: 'https://picsum.photos/seed/portfolio-founder/800/800',
    category: 'Websites',
    liveUrl: 'https://example.com/creative-founder',
    averageRating: 4.9,
    reviewCount: 14,
  },
  {
    title: 'Event Poster Collection',
    description: 'A bold event poster series crafted for youth events, conferences, and community activations.',
    imageUrl: 'https://picsum.photos/seed/event-posters/800/800',
    category: 'Print Design',
    averageRating: 4.6,
    reviewCount: 10,
  },
];

export default function LandingPage() {
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const seedData = async (existingProducts: Product[] = []) => {
    const productsRef = collection(db, 'products');
    const existingTitles = new Set(existingProducts.map((product) => product.title));
    const missingProjects = SHOWCASE_PROJECTS.filter((project) => !existingTitles.has(project.title));

    for (const project of missingProjects) {
      await addDoc(productsRef, {
        ...project,
        createdAt: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        
        const allQuery = query(productsRef, orderBy('createdAt', 'desc'));
        const allSnapshot = await getDocs(allQuery);

        const currentProducts = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const currentTitles = new Set(currentProducts.map((product) => product.title));
        const isShowcaseSparse =
          currentProducts.length < 8 ||
          SHOWCASE_PROJECTS.some((project) => !currentTitles.has(project.title));

        if (isShowcaseSparse) {
          await seedData(currentProducts);
          const retrySnapshot = await getDocs(allQuery);
          const products = retrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setAllProducts(products);
          setLatestProduct(products[0]);
        } else {
          setAllProducts(currentProducts);
          setLatestProduct(currentProducts[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mock data for "Past Services"
  const pastServices = [
    { id: '1', title: 'Corporate Branding', client: 'Anonymous Tech Corp', imageUrl: 'https://picsum.photos/seed/branding/800/600' },
    { id: '2', title: 'E-commerce Platform', client: 'Fashion Retailer', imageUrl: 'https://picsum.photos/seed/ecommerce/800/600' },
    { id: '3', title: 'AI Chatbot Integration', client: 'Customer Support Agency', imageUrl: 'https://picsum.photos/seed/chatbot/800/600' },
    { id: '4', title: 'Modern Logo Design', client: 'Startup Founder', imageUrl: 'https://picsum.photos/seed/logo/800/600' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero / Latest Product Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-0 h-full w-full bg-linear-to-br from-secondary/40 via-transparent to-white/5" />
          <img src="https://picsum.photos/seed/abstract/1920/1080?blur=10" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-secondary/35 bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary">
                <Sparkles className="w-3 h-3" />
                <span>Featured Creation</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Elevate Your <span className="text-secondary">Digital Presence</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/72">
                Kwetu Creations brings you premium design assets and cutting-edge business automation. 
                From stunning PSD templates to AI-integrated web solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services" className="flex items-center space-x-2 rounded-xl bg-secondary px-8 py-4 font-bold text-white shadow-lg shadow-secondary/25 transition-all hover:-translate-y-0.5 hover:bg-[#ad5817]">
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to='/products' className="rounded-xl border border-white/10 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Browse Portfolio
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {latestProduct ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
                  <img 
                    src={latestProduct.imageUrl} 
                    alt={latestProduct.title} 
                    className="rounded-xl w-full h-[400px] object-cover shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold">{latestProduct.title}</h3>
                      <p className="text-sm text-white/65">{latestProduct.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold uppercase tracking-[0.25em] text-secondary">{latestProduct.category}</span>
                      <Link to={`/product/${latestProduct.id}`} className="mt-1 block text-xs text-white/65 underline hover:text-white">
                        {latestProduct.liveUrl ? "View Project" : "View Showcase"}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                  <p className="text-white/50">Loading latest creation...</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* All Products Gallery */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Our Creations</h2>
            <p className="mt-2 text-primary/65">Websites, branding, social campaigns, and digital experiences we have already brought to life.</p>
          </div>
          <Link to="/products" className="flex items-center space-x-2 font-semibold text-secondary hover:underline">
            <span>View Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-primary/8 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-primary/15 bg-white/70 py-24 text-center">
                <Layout className="mx-auto mb-4 w-12 h-12 text-primary/25" />
                <p className="text-primary/60">No showcase projects found yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Services Overview */}
      <section className="relative overflow-hidden bg-secondary py-24 text-white">
        <div className="absolute top-0 right-0 h-full w-1/2 translate-x-24 skew-x-12 bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Beyond Just Design</h2>
            <p className="mx-auto max-w-2xl text-white/80">We provide end-to-end digital solutions to automate and grow your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Web Development', desc: 'Custom business websites built for performance and conversion.' },
              { icon: Zap, title: 'AI Automation', desc: 'Streamline your workflows with custom AI integrations and chatbots.' },
              { icon: MessageSquare, title: 'Voice Assistants', desc: 'Interactive voice solutions for your website and customer service.' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md transition-all hover:bg-white/18">
                <s.icon className="mb-6 h-10 w-10 text-white" />
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{s.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/services" className="inline-flex items-center space-x-2 rounded-xl bg-white px-8 py-4 font-bold text-primary transition-all hover:bg-white/90">
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Past Services / Anonymous Work */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Success Stories</h2>
          <p className="mt-2 text-primary/65">A glimpse into the custom designs and solutions we've delivered to our clients.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastServices.map((service) => (
            <div key={service.id} className="group relative rounded-2xl overflow-hidden aspect-video shadow-lg">
              <img 
                src={service.imageUrl} 
                alt={service.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="mb-2 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Service</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                <p className="text-sm text-white/75">Delivered for {service.client}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to transform your business?</h2>
          <p className="relative z-10 mx-auto mb-10 max-w-xl text-white/70">
            Whether you need a quick design template or a full-scale AI automation, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to="/services" className="rounded-xl bg-secondary px-8 py-4 font-bold text-white transition-all hover:bg-[#ad5817]">
              Get Started Now
            </Link>
            <Link to="/contact" className="rounded-xl border border-white/10 bg-white/10 px-8 py-4 font-bold text-white transition-all hover:bg-white/20">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
