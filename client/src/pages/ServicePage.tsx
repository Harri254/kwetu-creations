import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Layout, Palette, Zap, MessageSquare, Globe, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { createOrder, getServices, getSpecialistForService } from '../lib/dataStore';
import type { Service, Specialist } from '../data/mockdata';
import { useEffect } from 'react';

type ServiceType = 'Poster' | 'Logo' | 'Website' | 'AI Automation' | 'Voice Assistant';

const ICONS = {
  Layout,
  Palette,
  Zap,
  MessageSquare,
  Globe,
};

export default function ServicePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [assignedSpecialist, setAssignedSpecialist] = useState<Specialist | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    clientName: user?.displayName || '',
    email: user?.email || '',
    requirements: {} as Record<string, string>,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const nextServices = await getServices();
        setServices(nextServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services.');
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const selectedServiceRecord = services.find((service) => service.serviceType === selectedService);

  const handleServiceSelect = async (service: ServiceType) => {
    setSelectedService(service);
    setAssignedSpecialist(await getSpecialistForService(service));
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('req_')) {
      const reqName = name.replace('req_', '');
      setFormData((prev) => ({
        ...prev,
        requirements: { ...prev.requirements, [reqName]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login', { state: { from: '/services' } });
      return;
    }

    if (!selectedService) return;

    setLoading(true);
    try {
      const order = await createOrder(
        {
          userId: user.id,
          clientName: formData.clientName,
          designType: selectedService,
          specialistId: assignedSpecialist?.id || '',
          requirements: formData.requirements,
          status: 'pending',
          paymentStatus: 'unpaid',
          amount: selectedServiceRecord?.basePrice || 0,
        },
        {
          orderId: 'temp',
          senderId: user.id,
          senderName: user.displayName || 'Client',
          content: 'I have sent my order kindly. Process it.',
        },
      );

      toast.success('Order placed successfully!');
      navigate(`/chat/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRequirementsForm = () => {
    if (!selectedServiceRecord) return null;

    return (
      <div className="space-y-4">
        {selectedServiceRecord.requirementFields.map((field) => {
          const fieldName = `req_${field.key}`;
          const sharedClassName = 'w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500';

          return (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium text-neutral-700">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  name={fieldName}
                  onChange={handleInputChange}
                  className={sharedClassName}
                  required={field.required}
                  defaultValue=""
                >
                  <option value="">Select an option</option>
                  {(field.options || []).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  name={fieldName}
                  rows={3}
                  placeholder={field.placeholder || ''}
                  onChange={handleInputChange}
                  className={sharedClassName}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  name={fieldName}
                  placeholder={field.placeholder || ''}
                  onChange={handleInputChange}
                  className={sharedClassName}
                  required={field.required}
                  min={field.type === 'number' ? '1' : undefined}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900">Order a Custom Creation</h1>
        <p className="text-neutral-500">Tell us what you need, and we'll bring it to life.</p>
      </div>

      <div className="mb-12 flex items-center justify-center">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all', step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-200 text-neutral-400')}>
          {step > 1 ? <CheckCircle2 className="h-6 w-6" /> : '1'}
        </div>
        <div className={cn('h-1 w-16 transition-all', step >= 2 ? 'bg-blue-600' : 'bg-neutral-200')} />
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all', step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-200 text-neutral-400')}>
          {step > 2 ? <CheckCircle2 className="h-6 w-6" /> : '2'}
        </div>
        <div className={cn('h-1 w-16 transition-all', step >= 3 ? 'bg-blue-600' : 'bg-neutral-200')} />
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all', step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-200 text-neutral-400')}>
          3
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {servicesLoading ? (
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="h-36 animate-pulse rounded-2xl bg-primary/8" />
              ))
            ) : (
              services.map((option) => {
                const Icon = ICONS[option.icon as keyof typeof ICONS] || Layout;
                return (
                  <button key={option.id} onClick={() => handleServiceSelect(option.serviceType)} className="group flex items-start space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg">
                    <div className="rounded-xl bg-neutral-50 p-3 transition-colors group-hover:bg-blue-50">
                      <Icon className="h-6 w-6 text-neutral-600 group-hover:text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-neutral-900">{option.title}</h3>
                      <p className="mb-2 text-sm text-neutral-500">{option.description}</p>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Starts at ${option.basePrice}</span>
                    </div>
                  </button>
                );
              })
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <button onClick={() => setStep(1)} className="mb-6 flex items-center space-x-1 text-sm text-neutral-400 hover:text-neutral-900">
              <span>&larr; Back to services</span>
            </button>

            <h2 className="mb-8 flex items-center space-x-3 text-2xl font-bold">
              <span className="rounded-lg bg-blue-50 p-2">
                {selectedServiceRecord &&
                  React.createElement(ICONS[selectedServiceRecord.icon as keyof typeof ICONS] || Layout, { className: 'h-6 w-6 text-blue-600' })}
              </span>
              <span>{selectedService} Requirements</span>
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">Your Name</label>
                  <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-neutral-400">Specific Details</h3>
                {renderRequirementsForm()}
              </div>

              <button type="submit" className="flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700">
                <span>Continue to Review</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <button onClick={() => setStep(2)} className="mb-6 flex items-center space-x-1 text-sm text-neutral-400 hover:text-neutral-900">
              <span>&larr; Edit details</span>
            </button>

            <h2 className="mb-8 text-2xl font-bold">Review Your Order</h2>

            <div className="mb-8 space-y-6">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
                <div className="mb-4 flex justify-between">
                  <span className="text-neutral-500">Service Type</span>
                  <span className="font-bold text-neutral-900">{selectedService}</span>
                </div>
                {assignedSpecialist && (
                  <div className="mb-4 flex justify-between">
                    <span className="text-neutral-500">Specialist</span>
                    <span className="font-bold text-neutral-900">{assignedSpecialist.name}</span>
                  </div>
                )}
                <div className="mb-4 flex justify-between">
                  <span className="text-neutral-500">Client</span>
                  <span className="font-bold text-neutral-900">{formData.clientName}</span>
                </div>
                <div className="space-y-2 border-t border-neutral-200 pt-4">
                  <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Requirements</span>
                  {Object.entries(formData.requirements).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize text-neutral-500">{key.replace('_', ' ')}</span>
                      <span className="font-medium text-neutral-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <span className="font-bold text-blue-900">Estimated Total</span>
                <span className="text-2xl font-bold text-blue-600">${selectedServiceRecord?.basePrice}</span>
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="flex w-full items-center justify-center space-x-2 rounded-xl bg-neutral-900 py-4 font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Confirm & Start Chat</span>
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-neutral-400">
              By confirming, you'll be redirected to a private chat with our designers.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
