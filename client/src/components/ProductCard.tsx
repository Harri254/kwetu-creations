import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    category: string;
    averageRating?: number;
    reviewCount?: number;
  };
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <div className={cn(
      "group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-all duration-300",
      compact ? "flex items-center space-x-4 p-3" : "flex flex-col"
    )}>
      <div className={cn(
        "relative overflow-hidden",
        compact ? "w-24 h-24 flex-shrink-0 rounded-lg" : "aspect-square w-full"
      )}>
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {!compact && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-neutral-600 border border-neutral-100 shadow-sm">
            {product.category}
          </div>
        )}
      </div>

      <div className={cn("flex-grow", compact ? "pr-2" : "p-4 flex flex-col")}>
        <div className="flex justify-between items-start mb-1">
          <h3 className={cn("font-semibold text-neutral-900 line-clamp-1", compact ? "text-sm" : "text-lg")}>
            {product.title}
          </h3>
          {!compact && (
            <span className="font-bold text-blue-600">${product.price}</span>
          )}
        </div>

        <div className="flex items-center space-x-1 mb-3">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-neutral-600">{product.averageRating || '5.0'}</span>
          <span className="text-[10px] text-neutral-400">({product.reviewCount || 0})</span>
        </div>

        <div className={cn("mt-auto flex items-center justify-between", compact ? "mt-1" : "")}>
          {compact && <span className="font-bold text-blue-600 text-sm">${product.price}</span>}
          <Link 
            to={`/product/${product.id}`}
            className={cn(
              "flex items-center space-x-1 text-xs font-semibold text-neutral-900 hover:text-blue-600 transition-colors",
              compact ? "" : "bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100 w-full justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
            )}
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
