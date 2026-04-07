import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { Send, Phone, CreditCard, CheckCircle2, Loader2, User as UserIcon, ShieldCheck, Clock, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: any;
}

interface Order {
  id: string;
  userId: string;
  clientName: string;
  designType: string;
  status: string;
  paymentStatus: string;
  amount: number;
  requirements: any;
  createdAt: any;
}

export default function ChatPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, loading: authLoading } = useFirebase();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.error('Please login to view your chat');
      navigate('/');
      return;
    }

    if (!orderId) return;

    // Fetch order details
    const fetchOrder = async () => {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        const orderData = orderDoc.data() as Order;
        if (orderData.userId !== user.uid) {
          toast.error('Unauthorized access');
          navigate('/');
          return;
        }
        setOrder({ id: orderDoc.id, ...orderData });
      } else {
        toast.error('Order not found');
        navigate('/');
      }
    };

    fetchOrder();

    // Listen for messages
    const messagesQuery = query(
      collection(db, `orders/${orderId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [orderId, user, authLoading, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !orderId) return;

    setSending(true);
    try {
      await addDoc(collection(db, `orders/${orderId}/messages`), {
        orderId,
        senderId: user.uid,
        senderName: user.displayName || 'Client',
        content: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
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
    setTimeout(async () => {
      try {
        if (!orderId) return;
        await updateDoc(doc(db, 'orders', orderId), {
          paymentStatus: 'paid'
        });
        setOrder(prev => prev ? { ...prev, paymentStatus: 'paid' } : null);
        setShowPaymentModal(false);
        toast.success('Payment successful! Your order is now being processed.', { id: 'mpesa' });
        
        // Add system message
        await addDoc(collection(db, `orders/${orderId}/messages`), {
          orderId,
          senderId: 'system',
          senderName: 'Kwetu Bot',
          content: "Payment confirmed! Our team has been notified and will start working on your design immediately.",
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        toast.error('Payment failed. Please try again.', { id: 'mpesa' });
      } finally {
        setPaying(false);
      }
    }, 3000);
  };

  if (!order) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 flex items-center space-x-2">
              <span>Order #{order.id.slice(-6).toUpperCase()}</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider font-bold">
                {order.designType}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Started {formatDistanceToNow(order.createdAt?.toDate() || new Date())} ago</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {order.paymentStatus === 'unpaid' ? (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-600/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ${order.amount}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-bold border border-green-100">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-grow flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.uid;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="bg-neutral-50 text-neutral-500 text-[10px] px-3 py-1 rounded-full border border-neutral-100 uppercase tracking-widest font-bold">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                    isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-neutral-100 text-neutral-900 rounded-tl-none"
                  )}>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 px-1">
                    {msg.senderName} • {msg.timestamp ? formatDistanceToNow(msg.timestamp.toDate()) : 'just now'}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center space-x-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-grow px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            />
            <button 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              className="p-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="hidden md:block w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Order Summary</span>
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Service</span>
                <span className="font-semibold">{order.designType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount</span>
                <span className="font-semibold">${order.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                <span className="font-semibold capitalize">{order.status}</span>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">Requirements</span>
                {Object.entries(order.requirements).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="text-[10px] text-neutral-400 uppercase block">{key.replace('_', ' ')}</span>
                    <span className="text-neutral-700 font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Our designers are available Mon-Fri, 9am-6pm. Expect a response within 2-4 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">Complete Payment</h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-neutral-400 hover:text-neutral-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                  <span className="text-blue-900 font-medium">Total to Pay</span>
                  <span className="text-2xl font-bold text-blue-600">${order.amount}</span>
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
                        <div className="flex items-center space-x-2">
                          <input 
                            type="text" 
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            placeholder="2547XXXXXXXX" 
                            className="flex-grow px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
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

