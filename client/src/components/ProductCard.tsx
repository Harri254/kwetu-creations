import { Link } from 'react-router-dom';
import { Star, ArrowRight, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    averageRating?: number;
    reviewCount?: number;
    liveUrl?: string;
  };
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <div className={cn(
      "group overflow-hidden rounded-2xl border border-primary/10 bg-white/90 shadow-[0_16px_40px_rgba(7,46,74,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(7,46,74,0.12)]",
      compact ? "flex items-center space-x-4 p-3" : "flex flex-col"
    )}>
      <div className={cn(
        "relative overflow-hidden",
        compact ? "w-24 h-24 shrink-0 rounded-lg" : "aspect-square w-full"
      )}>
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {!compact && (
          <div className="absolute left-3 top-3 rounded-full border border-secondary/20 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary shadow-sm backdrop-blur-sm">
            {product.category}
          </div>
        )}
      </div>

      <div className={cn("grow", compact ? "pr-2" : "p-4 flex flex-col")}>
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className={cn("line-clamp-1 font-semibold text-primary", compact ? "text-sm" : "text-lg")}>
            {product.title}
          </h3>
          {product.liveUrl && !compact && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
              <Globe className="h-3 w-3" />
              Live
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 mb-3">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          <span className="text-xs font-medium text-primary/70">{product.averageRating || '5.0'}</span>
          <span className="text-[10px] text-primary/40">({product.reviewCount || 0})</span>
        </div>

        <div className={cn("mt-auto flex items-center justify-between", compact ? "mt-1" : "")}>
          {compact && product.liveUrl && (
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider ">
              <Globe className="h-3 w-3" />
              Live
            </span>
          )}
          <Link 
            to={`/product/${product.id}`}
            className={cn(
              "flex items-center space-x-1 text-xs font-semibold text-primary transition-colors ",
              compact ? "" : "w-full justify-center rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 group-hover:border-secondary group-hover:bg-secondary group-hover:text-white transition-all"
            )}
          >
            <span>{product.liveUrl ? 'View Project' : 'View Showcase'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
