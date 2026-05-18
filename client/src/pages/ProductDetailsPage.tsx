import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, MessageSquare, ShieldCheck, ArrowLeft, Loader2, Send, User as UserIcon, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { addReviewToProduct, getProductById } from '../lib/dataStore';
import type { Product, Review } from '../data/mockdata';

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const nextProduct = await getProductById(productId);
        if (nextProduct) {
          setProduct(nextProduct);
          setReviews(nextProduct.reviews);
          setSelectedImage(nextProduct.imageUrl);
        } else {
          toast.error('Product not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login', { state: { from: productId ? `/product/${productId}` : '/products' } });
      return;
    }

    if (!newReview.comment.trim() || !productId) return;

    setSubmittingReview(true);
    try {
      const review = await addReviewToProduct(productId, {
        userId: user.id,
        userName: user.displayName || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setReviews((prev) => [review, ...prev]);
      setProduct((prev) => prev ? {
        ...prev,
        reviews: [review, ...prev.reviews],
        reviewCount: (prev.reviewCount ?? 0) + 1,
        averageRating: ([review, ...prev.reviews].reduce((sum, item) => sum + item.rating, 0)) / ([review, ...prev.reviews].length),
      } : prev);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!product) return null;

  const galleryImages = [
    product.imageUrl,
    ...[1, 2, 3, 4].map((i) => `https://picsum.photos/seed/${product.id}${i}/400/400`),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center space-x-2 text-primary/55 transition-colors hover:text-primary">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to showcase</span>
      </button>

      <div className="mb-24 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="aspect-square overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm">
            <img src={selectedImage} alt={product.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={cn(
                  'aspect-square w-24 shrink-0 overflow-hidden rounded-xl border bg-primary/6 transition-all',
                  selectedImage === image
                    ? 'border-secondary shadow-[0_0_0_2px_rgba(196,103,27,0.2)] opacity-100'
                    : 'border-primary/10 opacity-55 hover:opacity-100',
                )}
                aria-label={`View showcase image ${index + 1}`}
              >
                <img src={image} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-8">
            <div className="mb-4 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-secondary">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Creation</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-primary">{product.title}</h1>
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={cn('w-4 h-4', i <= Math.round(product.averageRating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200')} />
                ))}
              </div>
              <span className="text-sm font-medium text-primary/60">{product.reviewCount || 0} reviews</span>
              <span className="text-primary/20">|</span>
              <span className="text-sm font-medium text-primary/60">{product.category}</span>
            </div>

            <div className="prose prose-neutral mb-6 max-w-none">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>

          <div className="space-y-4">
            {product.liveUrl ? (
              <a href={product.liveUrl} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center space-x-2 rounded-xl bg-secondary py-4 font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-[#ad5817]">
                <Globe className="h-5 w-5" />
                <span>Visit Live Project</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5 text-center">
                <p className="font-semibold text-primary">Private or offline project</p>
                <p className="mt-2 text-sm text-primary/60">
                  This showcase item does not have a public internet link, but it remains part of our delivered work.
                </p>
              </div>
            )}
            <div className="flex items-center justify-center space-x-6 text-xs font-medium text-primary/45">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Work</span>
              </div>
              {product.liveUrl && (
                <div className="flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>Public Link Available</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-12">
            <h2 className="mb-8 flex items-center space-x-3 text-2xl font-bold text-primary">
              <MessageSquare className="w-6 h-6 text-secondary" />
              <span>Client Feedback</span>
            </h2>

            <div className="mb-12 rounded-2xl border border-primary/10 bg-white/80 p-6">
              <h3 className="mb-4 font-bold text-primary">Leave a Review</h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div className="mb-2 flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" onClick={() => setNewReview({ ...newReview, rating: i })} className="focus:outline-none">
                      <Star className={cn('h-6 w-6 transition-colors', i <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 hover:text-yellow-200')} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="What do you think about this project?"
                  className="w-full rounded-xl border border-primary/12 bg-white px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-secondary/20"
                  required
                />
                <button type="submit" disabled={submittingReview} className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50">
                  {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>Post Review</span>
                </button>
              </form>
            </div>

            <div className="space-y-8">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="flex space-x-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/6">
                      <UserIcon className="h-5 w-5 text-primary/40" />
                    </div>
                    <div className="grow">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="font-bold text-primary">{review.userName}</h4>
                        <span className="text-[10px] font-medium text-primary/35">
                          {formatDistanceToNow(new Date(review.createdAt))} ago
                        </span>
                      </div>
                      <div className="mb-2 flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={cn('h-3 w-3', i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200')} />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-primary/65">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-sm italic text-primary/40">
                  No reviews yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
