import { ShieldCheck, Target, Users, Zap, Globe, Palette } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/about/1920/1080" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-bold tracking-tight mb-6">We are <span className="text-blue-500">Kwetu Creations</span></h1>
            <p className="text-xl text-neutral-400 leading-relaxed">
              A creative powerhouse dedicated to transforming how businesses interact with the digital world. 
              Based in Nairobi, we blend local creativity with global technology standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">Our Mission</h2>
            <p className="text-neutral-600 leading-relaxed">
              To empower entrepreneurs and businesses by providing high-quality, accessible design assets 
               and innovative automation solutions that drive growth and efficiency.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900">Our Vision</h2>
            <p className="text-neutral-600 leading-relaxed">
              To be the leading digital hub in East Africa, where creativity meets technology to solve 
              real-world business challenges through design and AI.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-neutral-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">What We Do</h2>
            <p className="text-neutral-500 mt-4">A comprehensive suite of digital services tailored for modern brands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: 'Digital Marketplace', desc: 'Browse and purchase premium PSD templates, logos, and graphic assets ready for your next project.' },
              { icon: Zap, title: 'AI Automation', desc: 'We build custom AI chatbots and automated workflows to save your business time and money.' },
              { icon: Globe, title: 'Web Solutions', desc: 'From landing pages to complex e-commerce platforms, we build websites that convert visitors into customers.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-neutral-900 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-3xl -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Why Kwetu Creations?</h2>
              <div className="space-y-6">
                {[
                  { title: 'Quality First', desc: 'Every design and line of code is crafted with precision and care.' },
                  { title: 'Local Expertise', desc: 'We understand the East African market and business landscape.' },
                  { title: 'Cutting Edge', desc: 'We stay ahead of the curve with the latest AI and web technologies.' },
                  { title: 'Secure Payments', desc: 'Safe and easy transactions via M-Pesa and international cards.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="mt-1 bg-blue-600/20 p-1 rounded-full">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-neutral-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://picsum.photos/seed/team/800/800" className="rounded-3xl shadow-2xl" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="text-4xl font-bold">500+</p>
                <p className="text-blue-100 text-sm">Projects Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
