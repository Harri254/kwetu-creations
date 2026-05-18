import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Layout } from 'lucide-react';
import { getProducts } from '../lib/dataStore';
import type { Product } from '../data/mockdata';

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
        const allProducts = await getProducts();
        const filtered = allProducts.filter((product) => {
          const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
          const text = `${product.title} ${product.description}`.toLowerCase();
          const matchesSearch = text.includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });

        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-primary">Project Showcase</h1>
          <p className="text-primary/65">A curated gallery of design, branding, and web work we have delivered.</p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <div className="relative grow md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/40" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-primary/12 bg-white/90 py-2 pl-10 pr-4 outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <div className="flex items-center space-x-2 rounded-xl border border-primary/12 bg-white/90 px-3 py-2">
            <Filter className="h-4 w-4 text-primary/40" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="cursor-pointer bg-transparent text-sm font-medium text-primary outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-4/5 rounded-xl bg-primary/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-6 font-semibold text-secondary hover:underline">
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

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
