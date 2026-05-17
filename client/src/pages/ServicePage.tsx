import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Layout, Palette, Zap, MessageSquare, Globe, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { createOrder, getSpecialistForService } from '../lib/mockStore';
import type { Specialist } from '../data/mockdata';

type ServiceType = 'Poster' | 'Logo' | 'Website' | 'AI Automation' | 'Voice Assistant';

interface ServiceOption {
  id: ServiceType;
  title: string;
  description: string;
  icon: any;
  basePrice: number;
}

const serviceOptions: ServiceOption[] = [
  { id: 'Poster', title: 'Graphic Design', description: 'Posters, flyers, and social media assets.', icon: Palette, basePrice: 25 },
  { id: 'Logo', title: 'Logo & Branding', description: 'Unique visual identity for your brand.', icon: Layout, basePrice: 50 },
  { id: 'Website', title: 'Web Development', description: 'Custom business websites and landing pages.', icon: Globe, basePrice: 250 },
  { id: 'AI Automation', title: 'AI Automation', description: 'Streamline workflows with AI & chatbots.', icon: Zap, basePrice: 150 },
  { id: 'Voice Assistant', title: 'Voice Assistant', description: 'Interactive voice solutions for your site.', icon: MessageSquare, basePrice: 200 },
];

export default function ServicePage() {
  const { user } = useFirebase();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [assignedSpecialist, setAssignedSpecialist] = useState<Specialist | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    clientName: user?.displayName || '',
    email: user?.email || '',
    requirements: {} as Record<string, string>,
  });

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
          userId: user.uid,
          clientName: formData.clientName,
          designType: selectedService,
          specialistId: assignedSpecialist?.id || '',
          requirements: formData.requirements,
          status: 'pending',
          paymentStatus: 'unpaid',
          amount: serviceOptions.find((s) => s.id === selectedService)?.basePrice || 0,
        },
        {
          orderId: 'temp',
          senderId: user.uid,
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
    switch (selectedService) {
      case 'Poster':
      case 'Logo':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Design Style</label>
              <select name="req_style" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select a style</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Modern">Modern</option>
                <option value="Vintage">Vintage</option>
                <option value="Bold">Bold & Vibrant</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Color Palette Preference</label>
              <input type="text" name="req_colors" placeholder="e.g. Blue and White, Earthy tones" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Specific Text/Content</label>
              <textarea name="req_content" rows={3} placeholder="What text should be included?" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case 'Website':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Number of Pages</label>
              <input type="number" name="req_pages" min="1" placeholder="e.g. 5" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Key Features Needed</label>
              <textarea name="req_features" rows={3} placeholder="e.g. Contact form, Blog, E-commerce" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      case 'AI Automation':
      case 'Voice Assistant':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Current Workflow Description</label>
              <textarea name="req_workflow" rows={3} placeholder="Describe the process you want to automate" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">Platform Integration</label>
              <input type="text" name="req_platform" placeholder="e.g. WhatsApp, Website, Slack" onChange={handleInputChange} className="w-full rounded-lg border border-neutral-200 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
        );
      default:
        return null;
    }
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
            {serviceOptions.map((option) => (
              <button key={option.id} onClick={() => handleServiceSelect(option.id)} className="group flex items-start space-x-4 rounded-2xl border border-neutral-200 bg-white p-6 text-left transition-all hover:border-blue-500 hover:shadow-lg">
                <div className="rounded-xl bg-neutral-50 p-3 transition-colors group-hover:bg-blue-50">
                  <option.icon className="h-6 w-6 text-neutral-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-neutral-900">{option.title}</h3>
                  <p className="mb-2 text-sm text-neutral-500">{option.description}</p>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Starts at ${option.basePrice}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <button onClick={() => setStep(1)} className="mb-6 flex items-center space-x-1 text-sm text-neutral-400 hover:text-neutral-900">
              <span>&larr; Back to services</span>
            </button>

            <h2 className="mb-8 flex items-center space-x-3 text-2xl font-bold">
              <span className="rounded-lg bg-blue-50 p-2">
                {serviceOptions.find((s) => s.id === selectedService)?.icon &&
                  React.createElement(serviceOptions.find((s) => s.id === selectedService)!.icon, { className: 'h-6 w-6 text-blue-600' })}
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
                <span className="text-2xl font-bold text-blue-600">${serviceOptions.find((s) => s.id === selectedService)?.basePrice}</span>
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
