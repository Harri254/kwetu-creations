import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Layout, Palette, Zap, MessageSquare, ShieldCheck, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  averageRating?: number;
  reviewCount?: number;
  createdAt: any;
}

export default function LandingPage() {
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const seedData = async () => {
    const productsRef = collection(db, 'products');
    const initialProducts = [
      {
        title: "Modern Corporate Flyer",
        description: "A clean and professional flyer template for corporate events. Fully editable PSD with organized layers.",
        imageUrl: "https://picsum.photos/seed/flyer1/800/800",
        price: 15,
        category: "Posters",
        averageRating: 4.8,
        reviewCount: 12,
        createdAt: serverTimestamp()
      },
      {
        title: "Minimalist Logo Pack",
        description: "A collection of 20 minimalist logo templates. Vector based and scalable to any size.",
        imageUrl: "https://picsum.photos/seed/logo1/800/800",
        price: 45,
        category: "Logos",
        averageRating: 5.0,
        reviewCount: 8,
        createdAt: serverTimestamp()
      },
      {
        title: "E-commerce UI Kit",
        description: "Complete UI kit for a modern e-commerce website. Includes 50+ components and 10 screens.",
        imageUrl: "https://picsum.photos/seed/uikit1/800/800",
        price: 89,
        category: "Web Assets",
        averageRating: 4.9,
        reviewCount: 24,
        createdAt: serverTimestamp()
      },
      {
        title: "Social Media Post Pack",
        description: "30 Instagram post templates designed to boost engagement. Easy to customize in Photoshop.",
        imageUrl: "https://picsum.photos/seed/social1/800/800",
        price: 25,
        category: "Social Media",
        averageRating: 4.7,
        reviewCount: 15,
        createdAt: serverTimestamp()
      }
    ];

    for (const p of initialProducts) {
      await addDoc(productsRef, p);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        
        const allQuery = query(productsRef, orderBy('createdAt', 'desc'));
        const allSnapshot = await getDocs(allQuery);
        
        if (allSnapshot.empty) {
          await seedData();
          // Re-fetch after seeding
          const retrySnapshot = await getDocs(allQuery);
          const products = retrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setAllProducts(products);
          setLatestProduct(products[0]);
        } else {
          const products = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
          setAllProducts(products);
          setLatestProduct(products[0]);
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
      <section className="relative bg-neutral-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/30 to-transparent" />
          <img src="https://picsum.photos/seed/abstract/1920/1080?blur=10" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-600/30">
                <Sparkles className="w-3 h-3" />
                <span>Featured Creation</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Elevate Your <span className="text-blue-500">Digital Presence</span>
              </h1>
              <p className="text-lg text-neutral-400 mb-8 max-w-lg leading-relaxed">
                Kwetu Creations brings you premium design assets and cutting-edge business automation. 
                From stunning PSD templates to AI-integrated web solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-2">
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#gallery" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
                  Browse Portfolio
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {latestProduct ? (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl">
                  <img 
                    src={latestProduct.imageUrl} 
                    alt={latestProduct.title} 
                    className="rounded-xl w-full h-[400px] object-cover shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold">{latestProduct.title}</h3>
                      <p className="text-neutral-400 text-sm">{latestProduct.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-blue-500">${latestProduct.price}</span>
                      <Link to={`/product/${latestProduct.id}`} className="block text-xs text-neutral-400 hover:text-white mt-1 underline">View Details</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-2xl h-[400px] flex items-center justify-center border border-white/10 border-dashed">
                  <p className="text-neutral-500">Loading latest creation...</p>
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
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Our Creations</h2>
            <p className="text-neutral-500 mt-2">Premium design templates and assets for your next big idea.</p>
          </div>
          <Link to="/products" className="text-blue-600 font-semibold flex items-center space-x-2 hover:underline">
            <span>View Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed">
                <Layout className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">No products found. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Services Overview */}
      <section className="bg-blue-600 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Beyond Just Design</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">We provide end-to-end digital solutions to automate and grow your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: 'Web Development', desc: 'Custom business websites built for performance and conversion.' },
              { icon: Zap, title: 'AI Automation', desc: 'Streamline your workflows with custom AI integrations and chatbots.' },
              { icon: MessageSquare, title: 'Voice Assistants', desc: 'Interactive voice solutions for your website and customer service.' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <s.icon className="w-10 h-10 mb-6 text-blue-200" />
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/services" className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all">
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Past Services / Anonymous Work */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">Success Stories</h2>
          <p className="text-neutral-500 mt-2">A glimpse into the custom designs and solutions we've delivered to our clients.</p>
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
                <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Service</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{service.title}</h3>
                <p className="text-neutral-300 text-sm">Delivered for {service.client}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to transform your business?</h2>
          <p className="text-neutral-400 mb-10 max-w-xl mx-auto relative z-10">
            Whether you need a quick design template or a full-scale AI automation, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to="/services" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Get Started Now
            </Link>
            <Link to="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
