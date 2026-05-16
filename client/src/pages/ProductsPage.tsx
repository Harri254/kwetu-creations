import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Layout, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

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

const CATEGORIES = ['All', 'Posters', 'Logos', 'Social Media', 'Web Assets'];

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
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">PSD Templates Marketplace</h1>
          <p className="text-neutral-500">Premium design assets ready for your creative projects.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-neutral-200 rounded-xl px-3 py-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm font-medium text-neutral-700 outline-none cursor-pointer"
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
            <div key={i} className="aspect-[4/5] bg-neutral-100 rounded-xl animate-pulse" />
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
            <div className="py-32 text-center bg-white rounded-3xl border border-neutral-200 border-dashed">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">No templates found</h3>
              <p className="text-neutral-500">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-6 text-blue-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Trust Badges */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-neutral-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <SlidersHorizontal className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-1">Fully Customizable</h4>
            <p className="text-sm text-neutral-500">All PSD files are organized with named layers for easy editing.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <Search className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-1">High Resolution</h4>
            <p className="text-sm text-neutral-500">Print-ready files at 300 DPI for the best possible output.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Layout className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-1">Instant Download</h4>
            <p className="text-sm text-neutral-500">Get access to your files immediately after successful payment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
