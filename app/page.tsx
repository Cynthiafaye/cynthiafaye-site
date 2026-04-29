'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

function SparkleField({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string; size: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 6}s`,
      size: 2 + Math.random() * 5,
    }));
    setParticles(p);
  }, [count]);

  return (
    <div className="sparkle-field">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function GlitterDots({ count = 20 }: { count?: number }) {
  const [dots, setDots] = useState<Array<{ id: number; left: string; top: string; delay: string; size: number }>>([]);

  useEffect(() => {
    const d = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      size: 2 + Math.random() * 3,
    }));
    setDots(d);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: '#ffd700',
            boxShadow: '0 0 6px #ffd700, 0 0 12px rgba(255,215,0,0.5)',
            animation: `glitter-pulse 2s ease-in-out infinite`,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#tiktok', label: 'TikTok' },
    { href: '#testimonials', label: 'Reviews' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-lg shadow-pink-100/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className={`font-script text-2xl md:text-3xl transition-colors ${scrolled ? 'text-pink-500' : 'text-gold-bright'}`}>
          Cynthia Faye
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-display text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
                scrolled ? 'text-purple-800 hover:text-pink-500' : 'text-white/90 hover:text-gold-bright'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn-glam text-sm !py-2 !px-5">
            Book a Reading
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden text-2xl p-2 ${scrolled ? 'text-pink-500' : 'text-gold-bright'}`}
          aria-label="Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-t border-pink-100 px-6 pb-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-display text-sm tracking-[0.2em] uppercase text-purple-800 hover:text-pink-500 transition-colors border-b border-pink-50"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="btn-glam text-sm !py-2 !px-5 inline-block mt-4"
          >
            Book a Reading
          </a>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-glam-hero">
      <SparkleField count={50} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-gold-bright/15 animate-rotate-slow" />
        <div className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] rounded-full border border-pink-400/15 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        <div className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px] rounded-full border border-purple-400/10 animate-rotate-slow" style={{ animationDuration: '15s' }} />
      </div>

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-bright/10 rounded-full blur-[150px]" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto mb-8 animate-float">
            <div className="absolute inset-[-12px] rounded-2xl bg-gradient-to-br from-gold-bright/40 via-pink-500/30 to-purple-500/30 blur-2xl animate-glow-pulse" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-gold-bright/50 shadow-2xl shadow-gold-bright/20">
              <Image
                src="/cynthia-faye-profile.png"
                alt="Cynthia Faye - The Gift"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gold-bright rounded-full blur-sm animate-sparkle" />
            <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-pink-400 rounded-full blur-sm animate-sparkle" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 -right-4 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-sparkle" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <h1 className="font-script text-5xl md:text-7xl lg:text-8xl text-shimmer mb-4">
            Cynthia Faye
          </h1>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <p className="font-display text-lg md:text-xl tracking-[0.3em] uppercase text-pink-200 mb-2">
            The Gift
          </p>
          <div className="divider-glam w-48 mx-auto my-4" />
          <p className="font-display text-base md:text-lg tracking-[0.15em] uppercase text-gold-bright/90">
            Medium & Psychic Coach
          </p>
          <p className="text-purple-200 text-lg md:text-xl mt-3 font-body">
            More Than 30 Years Experience
          </p>
        </div>

        <div className="animate-slide-up mt-10" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
          <a href="#services" className="btn-glam text-base md:text-lg">
            &#10024; Book a Reading &#10024;
          </a>
        </div>

        <div className="animate-slide-up mt-6" style={{ animationDelay: '1.1s', animationFillMode: 'both' }}>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star-gold text-xl">&#9733;</span>
            ))}
          </div>
          <p className="text-purple-200 text-sm mt-1 font-body">Trusted by hundreds of clients</p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-gold-bright/50 flex justify-center pt-2">
          <div className="w-1 h-3 bg-gold-bright/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      name: 'Diamond Reading',
      price: '$100',
      duration: '30 minutes',
      description: 'A focused, illuminating session that delivers clarity and guidance. Perfect for specific questions or a first-time experience with Cynthia.',
      icon: '♦',
      gradient: 'from-amber-400 to-yellow-300',
    },
    {
      name: 'Signature Reading',
      price: '$180',
      duration: '60 minutes',
      description: 'Cynthia\'s most popular reading. A deep, immersive journey into your past, present, and future. Comprehensive spiritual guidance tailored to your life path.',
      icon: '✨',
      gradient: 'from-pink-400 to-fuchsia-400',
      featured: true,
    },
    {
      name: 'Crossover Reading',
      price: '$180',
      duration: '60 minutes',
      description: 'Connect with loved ones who have crossed over. A profoundly healing experience that bridges the physical and spiritual worlds. Messages of love, closure, and peace.',
      icon: '☆',
      gradient: 'from-purple-400 to-violet-400',
    },
  ];

  return (
    <section id="services" className="relative py-24 md:py-32 bg-glam-light overflow-hidden">
      <GlitterDots count={25} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="font-display text-sm tracking-[0.3em] uppercase text-pink-500 mb-3">&#10024; Offerings &#10024;</p>
          <h2 className="font-display text-4xl md:text-5xl text-purple-900 heading-decorated">
            Readings & Services
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <div
              key={service.name}
              className={`card-glam rounded-2xl p-8 text-center relative group ${
                service.featured ? 'md:-mt-4 md:mb-4 ring-2 ring-pink-300/50' : ''
              }`}
            >
              {service.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-display tracking-[0.2em] uppercase px-4 py-1 rounded-full shadow-lg shadow-pink-300/30">
                  Most Popular
                </div>
              )}

              <div className={`text-4xl mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text`} style={{ WebkitTextFillColor: 'transparent' }}>
                {service.icon}
              </div>
              <h3 className="font-display text-2xl text-purple-800 mb-2">{service.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="font-display text-3xl text-pink-600">{service.price}</span>
                <span className="text-purple-400 text-sm font-body">/ {service.duration}</span>
              </div>
              <div className="divider-glam w-20 mx-auto mb-4" />
              <p className="text-purple-700/80 font-body text-lg leading-relaxed">{service.description}</p>

              <a
                href="#contact"
                className="btn-gold inline-block mt-6 text-sm"
              >
                Book Now
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="card-glam rounded-2xl p-8 text-center">
            <h3 className="font-display text-2xl text-purple-800 mb-4">&#10024; Additional Services &#10024;</h3>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-display text-lg text-pink-600 mb-2">Party Bookings</h4>
                <p className="text-purple-700/80 font-body text-base">
                  Hosting a gathering? Book Cynthia for your party, corporate event, or private group session. An unforgettable experience for your guests.
                </p>
              </div>
              <div>
                <h4 className="font-display text-lg text-pink-600 mb-2">Remote Sessions</h4>
                <p className="text-purple-700/80 font-body text-base">
                  Available by phone, Zoom, or in-person. The spiritual connection transcends distance. Get your reading from anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden bg-glam-pink">
      <GlitterDots count={15} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display text-sm tracking-[0.3em] uppercase text-pink-500 mb-3">&#10024; About &#10024;</p>
            <h2 className="font-display text-4xl md:text-5xl text-purple-900 mb-6">
              A Gift Passed Down Through Generations
            </h2>
            <div className="space-y-4 text-purple-800/80 font-body text-lg leading-relaxed">
              <p>
                For more than three decades, Cynthia Faye has been sharing her extraordinary gift with those seeking guidance, healing, and connection. What began as a natural intuition has blossomed into a life&apos;s calling.
              </p>
              <p>
                Every reading is a luxury experience -- intimate, compassionate, and deeply personal. Cynthia creates a sacred space where you feel safe to explore, question, and discover the messages that the universe has for you.
              </p>
              <p>
                Whether you&apos;re seeking clarity about your path, connection with a loved one who has crossed over, or simply a deeper understanding of yourself, Cynthia&apos;s warmth and accuracy will leave you transformed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '30+', label: 'Years Experience' },
              { value: '1000s', label: 'Lives Touched' },
              { value: '5.0', label: 'Star Rating' },
              { value: '3', label: 'Reading Types' },
            ].map((stat) => (
              <div key={stat.label} className="card-glam rounded-2xl p-6 text-center">
                <div className="font-display text-4xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
                <div className="font-display text-sm tracking-[0.15em] uppercase text-purple-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TikTokSection() {
  return (
    <section id="tiktok" className="relative py-24 md:py-32 bg-glam-light overflow-hidden">
      <GlitterDots count={12} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="font-display text-sm tracking-[0.3em] uppercase text-pink-500 mb-3">&#10024; Follow Along &#10024;</p>
          <h2 className="font-display text-4xl md:text-5xl text-purple-900 heading-decorated">
            @cynthiafayethegift
          </h2>
          <p className="text-purple-700/70 font-body text-lg mt-4 max-w-xl mx-auto">
            Join Cynthia on TikTok for daily spiritual insights, live readings, and behind-the-scenes moments.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="card-glam rounded-2xl aspect-[9/16] flex items-center justify-center group cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center group-hover:from-pink-200 group-hover:to-purple-200 transition-all duration-300">
                  <svg className="w-8 h-8 text-pink-400 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-purple-400 text-sm font-display tracking-wider">TikTok Video</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.tiktok.com/@cynthiafayethegift"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-display text-sm tracking-[0.15em] uppercase text-pink-600 border-2 border-pink-300 px-6 py-3 rounded-full hover:bg-pink-50 hover:border-pink-400 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.25 8.25 0 004.76 1.51V6.75a4.83 4.83 0 01-1-.06z"/>
            </svg>
            Follow on TikTok
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'Cynthia is absolutely incredible. She knew things about my late mother that no one could have known. I left feeling so much peace and closure. This was a life-changing experience.',
    },
    {
      name: 'Jennifer L.',
      text: 'I was skeptical going in, but Cynthia blew me away. Her accuracy is unreal. She described my grandmother perfectly and delivered a message that brought me to tears. Truly gifted.',
    },
    {
      name: 'Mike T.',
      text: 'Booked the Signature Reading and it was worth every penny. Cynthia has this amazing warmth and energy. She gave me clarity on decisions I\'d been struggling with for months.',
    },
    {
      name: 'Amanda R.',
      text: 'Had Cynthia at my birthday party and she was the highlight of the night! Everyone was amazed. She connected with so many of our loved ones. Already planning to book her again.',
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden bg-glam-pink">
      <GlitterDots count={15} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="font-display text-sm tracking-[0.3em] uppercase text-pink-500 mb-3">&#10024; Testimonials &#10024;</p>
          <h2 className="font-display text-4xl md:text-5xl text-purple-900 heading-decorated">
            What Clients Are Saying
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="card-glam rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="star-gold text-lg">&#9733;</span>
                ))}
              </div>
              <blockquote className="text-purple-800/80 font-body text-lg leading-relaxed mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div className="divider-glam w-12 mb-3" />
              <p className="font-display text-sm tracking-[0.15em] uppercase text-pink-500">{t.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.google.com/search?q=cynthia+faye+the+gift+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 font-body text-base hover:text-pink-500 transition-colors"
          >
            See all reviews on Google
            <span className="text-lg">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="relative py-24 md:py-32 bg-glam-light overflow-hidden">
      <GlitterDots count={18} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="font-display text-sm tracking-[0.3em] uppercase text-pink-500 mb-3">&#10024; Get in Touch &#10024;</p>
          <h2 className="font-display text-4xl md:text-5xl text-purple-900 heading-decorated">
            Book Your Reading
          </h2>
          <p className="text-purple-700/70 font-body text-lg mt-4 max-w-xl mx-auto">
            Ready to begin your journey? Reach out to schedule your personal reading with Cynthia.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card-glam rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-purple-800 mb-2">Phone</h3>
            <a href="tel:6369490117" className="text-pink-600 font-body text-xl hover:text-pink-500 transition-colors">
              (636) 949-0117
            </a>
            <p className="text-purple-400 font-body text-sm mt-2">Call or text to book</p>
          </div>

          <div className="card-glam rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-purple-800 mb-2">Location</h3>
            <p className="text-pink-600 font-body text-lg">Santa Rosa Beach, FL</p>
            <p className="text-purple-400 font-body text-sm mt-2">
              Serving Panama City Beach, Destin & the Emerald Coast
            </p>
          </div>

          <div className="card-glam rounded-2xl p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-purple-800 mb-2">Hours</h3>
            <p className="text-pink-600 font-body text-lg">Weekends</p>
            <p className="text-purple-400 font-body text-sm mt-2">8:00 AM - 9:00 PM</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://www.facebook.com/cynthiafayethegift"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-pink-300 flex items-center justify-center text-pink-500 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@cynthiafayethegift"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-pink-300 flex items-center justify-center text-pink-500 hover:bg-pink-50 hover:border-pink-400 transition-all duration-300"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.25 8.25 0 004.76 1.51V6.75a4.83 4.83 0 01-1-.06z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-purple-50 to-pink-50 border-t border-pink-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <p className="font-script text-3xl text-pink-500 mb-3">Cynthia Faye</p>
          <p className="font-display text-sm tracking-[0.2em] uppercase text-purple-400 mb-6">
            The Gift &mdash; Psychic Medium & Spiritual Coach
          </p>
          <div className="divider-glam w-32 mx-auto mb-6" />
          <p className="text-purple-400 font-body text-sm">
            &copy; {new Date().getFullYear()} Cynthia Faye &mdash; The Gift. All rights reserved.
          </p>
          <p className="text-purple-300 font-body text-xs mt-2">
            Santa Rosa Beach, FL &bull; Serving the Emerald Coast
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TikTokSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
