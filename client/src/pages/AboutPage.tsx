import { ShieldCheck, Target, Users, Zap, Globe, Palette } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/about/1920/1080" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="mb-6 text-5xl font-bold tracking-tight">We are <span className="text-secondary">Kwetu Creations</span></h1>
            <p className="text-xl leading-relaxed text-white/72">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/12">
              <Target className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
            <p className="leading-relaxed text-primary/70">
              To empower entrepreneurs and businesses by providing high-quality, accessible design assets 
               and innovative automation solutions that drive growth and efficiency.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/12">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">Our Vision</h2>
            <p className="leading-relaxed text-primary/70">
              To be the leading digital hub in East Africa, where creativity meets technology to solve 
              real-world business challenges through design and AI.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-white/55 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary">What We Do</h2>
            <p className="mt-4 text-primary/65">A comprehensive suite of digital services tailored for modern brands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: 'Creative Showcase', desc: 'Explore branding, graphics, and digital experiences we have designed and delivered for real projects.' },
              { icon: Zap, title: 'AI Automation', desc: 'We build custom AI chatbots and automated workflows to save your business time and money.' },
              { icon: Globe, title: 'Web Solutions', desc: 'From landing pages to complex e-commerce platforms, we build websites that convert visitors into customers.' },
            ].map((item, i) => (
              <div key={i} className="rounded-3xl border border-primary/10 bg-white/90 p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/6">
                  <item.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary">{item.title}</h3>
                <p className="text-sm leading-relaxed text-primary/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-primary p-12 text-white md:p-24">
          <div className="absolute top-0 right-0 h-full w-1/3 -translate-y-1/2 bg-secondary/15 blur-3xl" />
          
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
                    <div className="mt-1 rounded-full bg-secondary/15 p-1">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://picsum.photos/seed/team/800/800" className="rounded-3xl shadow-2xl" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-secondary p-8 shadow-xl md:block">
                <p className="text-4xl font-bold">500+</p>
                <p className="text-sm text-white/80">Projects Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
