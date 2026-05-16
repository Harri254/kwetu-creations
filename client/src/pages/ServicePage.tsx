import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { Layout, Palette, Zap, MessageSquare, Globe, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

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
  const { user, login } = useFirebase();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    clientName: user?.displayName || '',
    email: user?.email || '',
    requirements: {} as any,
  });

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('req_')) {
      const reqName = name.replace('req_', '');
      setFormData(prev => ({
        ...prev,
        requirements: { ...prev.requirements, [reqName]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to place an order');
      login();
      return;
    }

    if (!selectedService) return;

    setLoading(true);
    try {
      // 1. Create the order
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        clientName: formData.clientName,
        designType: selectedService,
        requirements: formData.requirements,
        status: 'pending',
        paymentStatus: 'unpaid',
        amount: serviceOptions.find(s => s.id === selectedService)?.basePrice || 0,
        createdAt: serverTimestamp(),
      });

      // 2. Create the initial auto-message
      await addDoc(collection(db, `orders/${orderRef.id}/messages`), {
        orderId: orderRef.id,
        senderId: user.uid,
        senderName: user.displayName || 'Client',
        content: "I have sent my order kindly. Process it.",
        timestamp: serverTimestamp(),
      });

      toast.success('Order placed successfully!');
      navigate(`/chat/${orderRef.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">Design Style</label>
              <select name="req_style" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required>
                <option value="">Select a style</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Modern">Modern</option>
                <option value="Vintage">Vintage</option>
                <option value="Bold">Bold & Vibrant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Color Palette Preference</label>
              <input type="text" name="req_colors" placeholder="e.g. Blue and White, Earthy tones" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Specific Text/Content</label>
              <textarea name="req_content" rows={3} placeholder="What text should be included?" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
          </div>
        );
      case 'Website':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Number of Pages</label>
              <input type="number" name="req_pages" min="1" placeholder="e.g. 5" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Key Features Needed</label>
              <textarea name="req_features" rows={3} placeholder="e.g. Contact form, Blog, E-commerce" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
          </div>
        );
      case 'AI Automation':
      case 'Voice Assistant':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Current Workflow Description</label>
              <textarea name="req_workflow" rows={3} placeholder="Describe the process you want to automate" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Platform Integration</label>
              <input type="text" name="req_platform" placeholder="e.g. WhatsApp, Website, Slack" onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Order a Custom Creation</h1>
        <p className="text-neutral-500">Tell us what you need, and we'll bring it to life.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all", step >= 1 ? "bg-blue-600 border-blue-600 text-white" : "border-neutral-200 text-neutral-400")}>
          {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : "1"}
        </div>
        <div className={cn("w-16 h-1 transition-all", step >= 2 ? "bg-blue-600" : "bg-neutral-200")} />
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all", step >= 2 ? "bg-blue-600 border-blue-600 text-white" : "border-neutral-200 text-neutral-400")}>
          {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : "2"}
        </div>
        <div className={cn("w-16 h-1 transition-all", step >= 3 ? "bg-blue-600" : "bg-neutral-200")} />
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all", step >= 3 ? "bg-blue-600 border-blue-600 text-white" : "border-neutral-200 text-neutral-400")}>
          "3"
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {serviceOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleServiceSelect(option.id)}
                className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-neutral-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
              >
                <div className="p-3 bg-neutral-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  <option.icon className="w-6 h-6 text-neutral-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-1">{option.title}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{option.description}</p>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Starts at ${option.basePrice}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm"
          >
            <button onClick={() => setStep(1)} className="text-sm text-neutral-400 hover:text-neutral-900 mb-6 flex items-center space-x-1">
              <span>&larr; Back to services</span>
            </button>
            
            <h2 className="text-2xl font-bold mb-8 flex items-center space-x-3">
              <span className="p-2 bg-blue-50 rounded-lg">
                {serviceOptions.find(s => s.id === selectedService)?.icon && 
                  React.createElement(serviceOptions.find(s => s.id === selectedService)!.icon, { className: "w-6 h-6 text-blue-600" })}
              </span>
              <span>{selectedService} Requirements</span>
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    name="clientName" 
                    value={formData.clientName} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    required 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Specific Details</h3>
                {renderRequirementsForm()}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm"
          >
            <button onClick={() => setStep(2)} className="text-sm text-neutral-400 hover:text-neutral-900 mb-6 flex items-center space-x-1">
              <span>&larr; Edit details</span>
            </button>

            <h2 className="text-2xl font-bold mb-8">Review Your Order</h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-500">Service Type</span>
                  <span className="font-bold text-neutral-900">{selectedService}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-neutral-500">Client</span>
                  <span className="font-bold text-neutral-900">{formData.clientName}</span>
                </div>
                <div className="space-y-2 pt-4 border-t border-neutral-200">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Requirements</span>
                  {Object.entries(formData.requirements).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-neutral-500 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-neutral-900 font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="font-bold text-blue-900">Estimated Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${serviceOptions.find(s => s.id === selectedService)?.basePrice}
                </span>
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Confirm & Start Chat</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-neutral-400 mt-4">
              By confirming, you'll be redirected to a private chat with our designers.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

