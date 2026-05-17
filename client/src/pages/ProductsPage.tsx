import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Layout } from 'lucide-react';

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

const CATEGORIES = ['All', 'Websites', 'Branding', 'Social Media', 'Automation', 'Print Design'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        let q = query(productsRef, orderBy('createdAt', 'desc'));
        
        if (selectedCategory !== 'All') {
          q = query(productsRef, where('category', '==', selectedCategory), orderBy('createdAt', 'desc'));
        }

        const snapshot = await getDocs(q);
        const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        // Client-side search filtering
        const filtered = fetchedProducts.filter(p => 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">Project Showcase</h1>
          <p className="text-primary/65">A curated gallery of design, branding, and web work we have delivered.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative grow md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-primary/12 bg-white/90 py-2 pr-4 pl-10 outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <div className="flex items-center space-x-2 rounded-xl border border-primary/12 bg-white/90 px-3 py-2">
            <Filter className="h-4 w-4 text-primary/40" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="cursor-pointer bg-transparent text-sm font-medium text-primary outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-4/5 rounded-xl bg-primary/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/15 bg-white/90 py-32 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/6">
                <Layout className="h-8 w-8 text-primary/25" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-primary">No projects found</h3>
              <p className="text-primary/60">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-6 font-semibold text-secondary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Trust Badges */}
      <div className="mt-24 grid grid-cols-1 gap-8 border-t border-primary/10 py-12 md:grid-cols-3">
        <div className="flex items-start space-x-4">
          <div className="rounded-xl bg-primary/6 p-3">
            <SlidersHorizontal className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="mb-1 font-bold text-primary">Brand-Focused Work</h4>
            <p className="text-sm text-primary/60">From graphics to web builds, each piece is tailored to a real client or use case.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="rounded-xl bg-secondary/10 p-3">
            <Search className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="mb-1 font-bold text-primary">Live References</h4>
            <p className="text-sm text-primary/60">Internet-based projects can include direct links so visitors can explore the real result.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="rounded-xl bg-primary/6 p-3">
            <Layout className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h4 className="mb-1 font-bold text-primary">Showcase Ready</h4>
            <p className="text-sm text-primary/60">Each entry highlights the visual work, category, feedback, and project context instead of pricing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
