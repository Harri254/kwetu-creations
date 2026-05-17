import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { toast } from 'react-hot-toast';
import {
  Send,
  Phone,
  CreditCard,
  Check,
  CheckCircle2,
  CheckCheck,
  Loader2,
  ShieldCheck,
  Clock,
  ArrowLeft,
  ArrowRight,
  X,
  UserRound,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
import { addMessageToOrder, getOrderById, getSpecialistById, markOrderPaid } from '../lib/mockStore';
import type { Order, Specialist } from '../data/mockdata';

export default function ChatPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, loading: authLoading } = useFirebase();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mpesaPhone, setMpesaPhone] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      toast.error('Please login to view your chat');
      navigate('/login', { state: { from: orderId ? `/chat/${orderId}` : '/' } });
      return;
    }

    if (!orderId) return;

    const fetchOrder = async () => {
      const nextOrder = await getOrderById(orderId);
      if (nextOrder) {
        if (nextOrder.userId !== user.uid) {
          toast.error('Unauthorized access');
          navigate('/login');
          return;
        }
        setOrder(nextOrder);
        setSpecialist(await getSpecialistById(nextOrder.specialistId));
      } else {
        toast.error('Order not found');
        navigate('/');
      }
    };

    fetchOrder();
  }, [orderId, user, authLoading, navigate]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [order?.messages]);

  const getOutgoingMessageState = (messageIndex: number) => {
    const ownUserId = user?.uid;
    if (!ownUserId || !order) return 'delivered';

    const laterMessages = order.messages.slice(messageIndex + 1);
    const hasReplyAfterMessage = laterMessages.some(
      (message) => message.senderId !== ownUserId && message.senderId !== 'system',
    );

    if (hasReplyAfterMessage) {
      return 'read';
    }

    if (specialist?.status === 'online') {
      return 'delivered';
    }

    return 'sent';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !orderId) return;

    setSending(true);
    try {
      const message = await addMessageToOrder(orderId, {
        orderId,
        senderId: user.uid,
        senderName: user.displayName || 'Client',
        content: newMessage,
      });

      setOrder((prev) => (
        prev
          ? {
              ...prev,
              messages: [...prev.messages, message],
            }
          : prev
      ));
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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

    if (!orderId) return;

    setPaying(true);
    toast.loading('Initiating M-Pesa STK Push...', { id: 'mpesa' });

    setTimeout(async () => {
      try {
        const paidOrder = await markOrderPaid(orderId);
        setOrder(paidOrder);
        setShowPaymentModal(false);
        toast.success('Payment successful! Your order is now being processed.', { id: 'mpesa' });

        const systemMessage = await addMessageToOrder(orderId, {
          orderId,
          senderId: 'system',
          senderName: 'Kwetu Bot',
          content: 'Payment confirmed! Our team has been notified and will start working on your design immediately.',
        });

        setOrder((prev) => (
          prev
            ? {
                ...prev,
                paymentStatus: paidOrder.paymentStatus,
                messages: [...prev.messages, systemMessage],
              }
            : prev
        ));
      } catch {
        toast.error('Payment failed. Please try again.', { id: 'mpesa' });
      } finally {
        setPaying(false);
      }
    }, 3000);
  };

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col px-4 py-6 lg:py-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="rounded-full p-2 transition-colors hover:bg-neutral-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="flex items-center space-x-2 text-xl font-bold text-neutral-900">
              <span>Order #{order.id.slice(-6).toUpperCase()}</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                {order.designType}
              </span>
            </h1>
            <p className="flex items-center space-x-1 text-xs text-neutral-500">
              <Clock className="h-3 w-3" />
              <span>Started {formatDistanceToNow(new Date(order.createdAt))} ago</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {order.paymentStatus === 'unpaid' ? (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
            >
              <CreditCard className="h-4 w-4" />
              <span>Pay ${order.amount}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 rounded-lg border border-green-100 bg-green-50 px-4 py-2 text-sm font-bold text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Paid</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-[0_24px_60px_rgba(7,46,74,0.12)]">
          {specialist && (
            <div className="border-b border-primary/10 bg-[linear-gradient(135deg,rgba(7,46,74,0.04),rgba(196,103,27,0.08))] px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 ring-4 ring-white/80">
                  <UserRound className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-primary">{specialist.name}</h2>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                        specialist.status === 'online'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-neutral-100 text-neutral-500',
                      )}
                    >
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          specialist.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-400',
                        )}
                      />
                      {specialist.status}
                    </span>
                  </div>
                  <p className="text-sm text-primary/60">{specialist.title}</p>
                </div>
              </div>
            </div>
          )}

          <div
            ref={messagesContainerRef}
            className="min-h-[300px] flex-1 space-y-4 bg-[radial-gradient(circle_at_top,_rgba(196,103,27,0.08),_transparent_28%),linear-gradient(180deg,rgba(248,251,253,0.98),rgba(244,247,249,0.98))] p-5 pb-4 lg:max-h-[calc(100vh-360px)] lg:overflow-y-auto"
          >
            {order.messages.map((msg, index) => {
              const isMe = msg.senderId === user?.uid;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <div className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary/45 shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={cn('flex flex-col gap-1', isMe ? 'items-end' : 'items-start')}>
                  <div
                    className={cn(
                      'max-w-[82%] rounded-[1.4rem] px-4 py-3 text-sm shadow-sm',
                      isMe
                        ? 'rounded-br-md bg-secondary text-white shadow-[0_10px_24px_rgba(196,103,27,0.22)]'
                        : 'rounded-bl-md border border-white/80 bg-white text-primary shadow-[0_10px_24px_rgba(7,46,74,0.08)]',
                    )}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <div className={cn('flex items-center gap-1 px-1 text-[10px]', isMe ? 'text-secondary/70' : 'text-primary/40')}>
                    <span>{formatDistanceToNow(new Date(msg.timestamp))} ago</span>
                    {isMe && getOutgoingMessageState(index) === 'sent' && (
                      <Check className="h-3.5 w-3.5 text-secondary/70" />
                    )}
                    {isMe && getOutgoingMessageState(index) === 'delivered' && (
                      <CheckCheck className="h-3.5 w-3.5 text-secondary/70" />
                    )}
                    {isMe && getOutgoingMessageState(index) === 'read' && (
                      <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex shrink-0 items-center gap-2 border-t border-primary/10 bg-white px-4 py-3"
          >
            <div className="flex flex-1 items-center rounded-full border border-primary/10 bg-neutral-50 px-3 shadow-inner">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-transparent px-2 py-3 text-primary outline-none placeholder:text-primary/45"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="rounded-full bg-secondary p-3 text-white shadow-[0_12px_24px_rgba(196,103,27,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#ad5817] disabled:translate-y-0 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="hidden w-80 flex-shrink-0 space-y-6 self-start md:block">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center space-x-2 font-bold text-neutral-900">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Order Summary</span>
            </h3>
            <div className="space-y-4 text-sm">
              {specialist && (
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-primary">
                    <UserRound className="h-4 w-4 text-secondary" />
                    <span>{specialist.name}</span>
                  </div>
                  <p className="text-xs text-primary/60">{specialist.title}</p>
                  <p className="mt-2 text-xs text-primary/70">
                    {specialist.status === 'online' ? 'Currently online' : 'Currently offline'} | {specialist.availability}
                  </p>
                </div>
              )}
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
              <div className="border-t border-neutral-100 pt-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-neutral-400">Requirements</span>
                {Object.entries(order.requirements).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="block text-[10px] uppercase text-neutral-400">{key.replace('_', ' ')}</span>
                    <span className="font-medium text-neutral-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <h3 className="mb-2 font-bold text-blue-900">Need Help?</h3>
            <p className="text-xs leading-relaxed text-blue-700">
              Our designers are available Mon-Fri, 9am-6pm. Expect a response within 2-4 hours.
            </p>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">Complete Payment</h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-neutral-400 hover:text-neutral-900">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <span className="font-medium text-blue-900">Total to Pay</span>
                  <span className="text-2xl font-bold text-blue-600">${order.amount}</span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Select Method</h3>

                  <div className="space-y-3">
                    <div className="rounded-2xl border-2 border-blue-600 bg-blue-50/50 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 font-bold text-white">M</div>
                          <span className="font-bold text-neutral-900">M-Pesa STK Push</span>
                        </div>
                        <div className="h-5 w-5 rounded-full border-4 border-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-neutral-500">Phone Number</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            placeholder="2547XXXXXXXX"
                            className="flex-grow rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleMpesaPayment}
                        disabled={paying}
                        className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-green-600 py-3 font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50"
                      >
                        {paying ? <Loader2 className="h-5 w-5 animate-spin" /> : <Phone className="h-4 w-4" />}
                        <span>Pay with M-Pesa</span>
                      </button>
                    </div>

                    <button className="group flex w-full items-center justify-between rounded-2xl border border-neutral-200 p-4 transition-all hover:border-neutral-900">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-neutral-900">Credit / Debit Card</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-900" />
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
