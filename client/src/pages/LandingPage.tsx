import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Layout, Zap, MessageSquare, ShieldCheck, Globe, Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getProducts } from '../lib/mockStore';
import type { Product, Review } from '../data/mockdata';

export default function LandingPage() {
  const [latestProduct, setLatestProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const featuredProducts = allProducts.slice(0, 4);
  const clientReviews = allProducts
    .flatMap((product) =>
      product.reviews.map((review) => ({
        ...review,
        productTitle: product.title,
        productCategory: product.category,
      })),
    )
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
        setLatestProduct(products[0] ?? null);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden bg-primary py-24 text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-secondary/40 via-transparent to-white/5" />
          <img src="https://picsum.photos/seed/abstract/1920/1080?blur=10" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-secondary/35 bg-secondary/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-secondary">
                <Sparkles className="w-3 h-3" />
                <span>Featured Creation</span>
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
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
                <Link to="products" className="rounded-xl border border-white/10 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Browse Portfolio
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              {latestProduct ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
                  <img src={latestProduct.imageUrl} alt={latestProduct.title} className="h-[400px] w-full rounded-xl object-cover shadow-lg" referrerPolicy="no-referrer" />
                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{latestProduct.title}</h3>
                      <p className="text-sm text-white/65">{latestProduct.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold uppercase tracking-[0.25em] text-secondary">{latestProduct.category}</span>
                      <Link to={`/product/${latestProduct.id}`} className="mt-1 block text-xs text-white/65 underline hover:text-white">
                        {latestProduct.liveUrl ? 'View Project' : 'View Showcase'}
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

      <section id="gallery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-primary/8 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-primary/15 bg-white/70 py-24 text-center">
                <Layout className="mx-auto mb-4 h-12 w-12 text-primary/25" />
                <p className="text-primary/60">No showcase projects found yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden bg-secondary py-24 text-white">
        <div className="absolute top-0 right-0 h-full w-1/2 translate-x-24 skew-x-12 bg-white/5" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Beyond Just Design</h2>
            <p className="mx-auto max-w-2xl text-white/80">We provide end-to-end digital solutions to automate and grow your business.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Globe, title: 'Web Development', desc: 'Custom business websites built for performance and conversion.' },
              { icon: Zap, title: 'AI Automation', desc: 'Streamline your workflows with custom AI integrations and chatbots.' },
              { icon: MessageSquare, title: 'Voice Assistants', desc: 'Interactive voice solutions for your website and customer service.' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md transition-all hover:bg-white/18">
                <s.icon className="mb-6 h-10 w-10 text-white" />
                <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Success Stories</h2>
          <p className="mt-2 text-primary/65">Real feedback shared by the clients we have worked with.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {clientReviews.length > 0 ? (
            clientReviews.map((review) => (
              <div key={review.id} className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Client Review</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary">{review.userName}</h3>
                    <p className="mt-1 text-sm text-primary/55">{review.productTitle}</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                    <Quote className="h-5 w-5" />
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={star <= review.rating ? 'h-4 w-4 fill-secondary text-secondary' : 'h-4 w-4 text-primary/15'}
                    />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-primary/70">"{review.comment}"</p>

                <div className="mt-6 flex items-center justify-between border-t border-primary/8 pt-4 text-xs text-primary/45">
                  <span>{review.productCategory}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-primary/15 bg-white/70 py-20 text-center">
              <MessageSquare className="mx-auto mb-4 h-10 w-10 text-primary/20" />
              <p className="text-primary/60">Client reviews will appear here once feedback is available.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/30 via-transparent to-transparent" />
          <h2 className="relative z-10 mb-6 text-3xl font-bold text-white md:text-4xl">Ready to transform your business?</h2>
          <p className="relative z-10 mx-auto mb-10 max-w-xl text-white/70">
            Whether you need a quick design template or a full-scale AI automation, we're here to help you succeed.
          </p>
          <div className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row">
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
