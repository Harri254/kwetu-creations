import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate email sending
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-neutral-500 mb-12 text-lg leading-relaxed">
            Have a question or a project in mind? We'd love to hear from you. 
            Fill out the form or use our contact details below.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Email Us</h3>
                <p className="text-neutral-500">info@kwetucreations.com</p>
                <p className="text-neutral-500">support@kwetucreations.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Call Us</h3>
                <p className="text-neutral-500">+254 700 000 000</p>
                <p className="text-neutral-500">Mon - Fri, 9am - 6pm</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="p-4 bg-blue-50 rounded-2xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">Our Studio</h3>
                <p className="text-neutral-500">Nairobi Business Hub, 4th Floor</p>
                <p className="text-neutral-500">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-6">Follow Our Journey</h3>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook, Globe].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-neutral-100 rounded-xl hover:bg-neutral-900 hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-[2.5rem] border border-neutral-200 p-8 md:p-12 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
              <textarea 
                rows={5} 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={sending}
              className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {sending ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
