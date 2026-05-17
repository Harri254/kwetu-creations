import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { Star, MessageSquare, ShieldCheck, ArrowLeft, Loader2, Send, User as UserIcon, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  averageRating?: number;
  reviewCount?: number;
  liveUrl?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const { user, login } = useFirebase();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error('Product not found');
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Listen for reviews
    const reviewsQuery = query(
      collection(db, `products/${productId}/reviews`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(revs);
    });

    return () => unsubscribe();
  }, [productId, navigate]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      login();
      return;
    }

    if (!newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, `products/${productId}/reviews`), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp(),
      });
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error('Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-secondary" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center space-x-2 text-primary/55 transition-colors hover:text-primary">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to showcase</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Product Image */}
        <div className="space-y-6">
          <div className="aspect-square overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square cursor-pointer overflow-hidden rounded-xl border border-primary/10 bg-primary/6 opacity-50 transition-opacity hover:opacity-100">
                <img src={`https://picsum.photos/seed/${product.id}${i}/400/400`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
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
                  <Star key={i} className={cn("w-4 h-4", i <= (product.averageRating || 5) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200")} />
                ))}
              </div>
              <span className="text-sm font-medium text-primary/60">{product.reviewCount || 0} reviews</span>
              <span className="text-primary/20">|</span>
              <span className="text-sm font-medium text-primary/60">{product.category}</span>
            </div>
            
            <div className="prose prose-neutral mb-12 max-w-none">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {product.liveUrl ? (
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-secondary py-4 font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-[#ad5817]"
              >
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
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-3xl">
        <h2 className="mb-8 flex items-center space-x-3 text-2xl font-bold text-primary">
          <MessageSquare className="w-6 h-6 text-secondary" />
          <span>Client Feedback</span>
        </h2>

        {/* Add Review Form */}
        <div className="mb-12 rounded-2xl border border-primary/10 bg-white/80 p-6">
          <h3 className="mb-4 font-bold text-primary">Leave a Review</h3>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: i })}
                  className="focus:outline-none"
                >
                  <Star className={cn("w-6 h-6 transition-colors", i <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 hover:text-yellow-200")} />
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
            <button 
              type="submit" 
              disabled={submittingReview}
              className="flex items-center space-x-2 rounded-lg bg-primary px-6 py-2 font-bold text-white transition-all disabled:opacity-50 hover:bg-primary/90"
            >
              {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Post Review</span>
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex space-x-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/6">
                  <UserIcon className="w-5 h-5 text-primary/40" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-primary">{review.userName}</h4>
                    <span className="text-[10px] font-medium text-primary/35">
                      {review.createdAt ? formatDistanceToNow(review.createdAt.toDate()) : 'just now'} ago
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200")} />
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
  );
}

