'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NavBar({ isBookingPage = false }: { isBookingPage?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = isBookingPage
    ? [
        { href: '/#services', label: 'Services' },
        { href: '/#about', label: 'About' },
        { href: '/#testimonials', label: 'Reviews' },
        { href: '/#contact', label: 'Contact' },
      ]
    : [
        { href: '#services', label: 'Services' },
        { href: '#about', label: 'About' },
        { href: '#tiktok', label: 'TikTok' },
        { href: '#testimonials', label: 'Reviews' },
        { href: '#contact', label: 'Contact' },
      ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isBookingPage
          ? 'bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-lg shadow-pink-100/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className={`font-script text-2xl md:text-3xl transition-colors ${scrolled || isBookingPage ? 'text-pink-500' : 'text-gold-bright'}`}>
          Cynthia Faye
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            isBookingPage ? (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-sm tracking-[0.2em] uppercase transition-colors duration-300 text-purple-800 hover:text-pink-500"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`font-display text-sm tracking-[0.2em] uppercase transition-colors duration-300 ${
                  scrolled ? 'text-purple-800 hover:text-pink-500' : 'text-white/90 hover:text-gold-bright'
                }`}
              >
                {link.label}
              </a>
            )
          ))}
          {!isBookingPage && (
            <Link href="/booking" className="btn-glam text-sm !py-2 !px-5">
              Book a Reading
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden text-2xl p-2 ${scrolled || isBookingPage ? 'text-pink-500' : 'text-gold-bright'}`}
          aria-label="Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-purple-950/95 backdrop-blur-lg border-t border-gold-bright/20 px-6 pb-6">
          {links.map((link) => (
            isBookingPage ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-display text-sm tracking-[0.2em] uppercase text-gold-bright hover:text-pink-400 transition-colors border-b border-gold-bright/20"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 font-display text-sm tracking-[0.2em] uppercase text-gold-bright hover:text-pink-400 transition-colors border-b border-gold-bright/20"
              >
                {link.label}
              </a>
            )
          ))}
          {!isBookingPage && (
            <Link
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="btn-glam text-sm !py-2 !px-5 inline-block mt-4"
            >
              Book a Reading
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
