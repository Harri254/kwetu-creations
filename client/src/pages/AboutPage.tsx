import { ShieldCheck, Target, Users, Zap, Globe, Palette, Sparkles, MessageSquareHeart } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  return (
    <div className="pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-14 text-white">
        <div className="absolute inset-0 opacity-10">
          <img src="https://picsum.photos/seed/about/1920/1080" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              About <span className="text-secondary">Kwetu Creations</span>
            </h1>
            <p className="text-lg leading-relaxed text-white/72 md:text-xl">
              We are a passionate graphic design company dedicated to transforming ideas into visually stunning work that
              captivates, engages, and communicates with purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Values */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-primary">Our Story</h2>
            <p className="mt-4 text-lg leading-relaxed text-primary/70">
              We are a passionate design-led team committed to helping startups and established businesses express their vision
              with clarity, confidence, and originality.
            </p>
          </div>

          <div className="space-y-6 text-center md:text-left">
            <p className="text-lg leading-relaxed text-primary/70">
              At Kwetu Creations, great design is more than aesthetics. It is effective communication. We work closely with
              every client to understand their brand identity, goals, and audience so the final result feels intentional and memorable.
            </p>

            <div className="rounded-3xl border-l-4 border-secondary bg-primary/5 p-6">
              <p className="text-lg leading-relaxed text-primary/75">
                Our work is guided by quality, attention to detail, and a belief that strong creative execution can elevate how
                people experience a brand.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/12">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-primary">Our Mission</h3>
              <p className="leading-relaxed text-primary/70">
                To bring ideas to life through thoughtful design, strong collaboration, and digital solutions that help brands connect
                with people in a meaningful way.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/12">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-primary">Our Vision</h3>
              <p className="leading-relaxed text-primary/70">
                To be a trusted creative partner for businesses that want design, branding, and digital experiences that are both
                beautiful and effective.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Creativity',
                desc: 'We approach every project with fresh thinking and a passion for visually compelling work.',
              },
              {
                icon: MessageSquareHeart,
                title: 'Communication',
                desc: 'We believe design should speak clearly, connect emotionally, and support real business goals.',
              },
              {
                icon: ShieldCheck,
                title: 'Quality',
                desc: 'Attention to detail, consistency, and professionalism shape everything we deliver.',
              },
            ].map((value) => (
              <div key={value.title} className="rounded-3xl border border-primary/10 bg-white/90 p-8 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/6">
                  <value.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary">{value.title}</h3>
                <p className="text-sm leading-relaxed text-primary/60">{value.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <p className="rounded-2xl border border-secondary/20 bg-secondary/10 px-6 py-4 text-lg italic text-primary/75">
              "Our commitment to quality and attention to detail set us apart."
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-white/55 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-primary">What We Do</h2>
            <p className="mt-4 text-primary/65">A comprehensive suite of digital services tailored for modern brands.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-primary p-8 text-white md:p-12">
          <div className="absolute top-0 right-0 h-full w-1/3 -translate-y-1/2 bg-secondary/15 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-5 text-4xl font-bold">Why Kwetu Creations?</h2>
              <div className="space-y-6">
                {[
                  { title: 'Client Collaboration', desc: "We listen closely so each project reflects the client's real vision and identity." },
                  { title: 'Attention to Detail', desc: 'Every layout, interaction, and visual choice is refined with care.' },
                  { title: 'Creative Range', desc: 'From branding pieces to websites and automation, we bring ideas to life across mediums.' },
                  { title: 'Purpose-Driven Design', desc: 'We create work that is not only attractive, but useful, strategic, and memorable.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="mt-1 rounded-full bg-secondary/15 p-1">
                      <ShieldCheck className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://picsum.photos/seed/team/800/800" className="rounded-3xl shadow-2xl" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-secondary p-8 shadow-xl md:block">
                <p className="text-4xl font-bold">Your Vision</p>
                <p className="text-sm text-white/80">Is Our Mission</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
