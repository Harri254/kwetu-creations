import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { Star, ShoppingCart, Download, MessageSquare, ShieldCheck, Clock, ArrowLeft, Loader2, Send, CreditCard, Phone, User as UserIcon, ArrowRight, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  psdUrl?: string;
  price: number;
  category: string;
  averageRating?: number;
  reviewCount?: number;
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
  const [paying, setPaying] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');

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

  const handleMpesaPayment = async () => {
    if (!mpesaPhone.match(/^254[17]\d{8}$/)) {
      toast.error('Please enter a valid M-Pesa number (2547XXXXXXXX)');
      return;
    }

    setPaying(true);
    toast.loading('Initiating M-Pesa STK Push...', { id: 'mpesa' });

    // Simulate STK Push
    setTimeout(() => {
      setHasPaid(true);
      setShowPaymentModal(false);
      setPaying(false);
      toast.success('Payment successful! Download link unlocked.', { id: 'mpesa' });
    }, 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center space-x-2 text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to gallery</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Product Image */}
        <div className="space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <img src={`https://picsum.photos/seed/${product.id}${i}/400/400`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Creation</span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={cn("w-4 h-4", i <= (product.averageRating || 5) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200")} />
                ))}
              </div>
              <span className="text-sm text-neutral-500 font-medium">{product.reviewCount || 0} reviews</span>
              <span className="text-neutral-300">|</span>
              <span className="text-sm text-neutral-500 font-medium">{product.category}</span>
            </div>
            <div className="text-3xl font-bold text-neutral-900 mb-8">${product.price}</div>
            
            <div className="prose prose-neutral max-w-none mb-12">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            {hasPaid ? (
              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-600/20">
                <Download className="w-5 h-5" />
                <span>Download PSD File</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Buy Now & Download</span>
              </button>
            )}
            <div className="flex items-center justify-center space-x-6 text-xs text-neutral-400 font-medium">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <span>Customer Feedback</span>
        </h2>

        {/* Add Review Form */}
        <div className="bg-neutral-50 rounded-2xl p-6 mb-12 border border-neutral-100">
          <h3 className="font-bold text-neutral-900 mb-4">Leave a Review</h3>
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
              placeholder="What do you think about this design?" 
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              required
            />
            <button 
              type="submit" 
              disabled={submittingReview}
              className="bg-neutral-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center space-x-2"
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
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-neutral-900">{review.userName}</h4>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {review.createdAt ? formatDistanceToNow(review.createdAt.toDate()) : 'just now'} ago
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200")} />
                    ))}
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-neutral-400 text-sm italic">
              No reviews yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">Checkout</h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-neutral-400 hover:text-neutral-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                  <span className="text-blue-900 font-medium">Total to Pay</span>
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Select Method</h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                          <span className="font-bold text-neutral-900">M-Pesa STK Push</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-4 border-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-500">Phone Number</label>
                        <input 
                          type="text" 
                          value={mpesaPhone}
                          onChange={(e) => setMpesaPhone(e.target.value)}
                          placeholder="2547XXXXXXXX" 
                          className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <button 
                        onClick={handleMpesaPayment}
                        disabled={paying}
                        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {paying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-4 h-4" />}
                        <span>Pay with M-Pesa</span>
                      </button>
                    </div>

                    <button className="w-full p-4 rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all flex items-center justify-between group">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-neutral-900">Credit / Debit Card</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

