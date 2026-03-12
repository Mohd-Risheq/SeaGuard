'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface NavbarProps {
  dict: any;
  locale: string;
}

export default function Navbar({ dict, locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  };

  const navItems = [
    { href: '#aqaba', label: dict.nav.aqaba },
    { href: '#about', label: dict.nav.about },
    { href: '#fleet', label: dict.nav.fleet },
    { href: '#pricing', label: dict.nav.pricing },
    { href: '#experience', label: dict.nav.experience },
    { href: '#reviews', label: dict.nav.reviews },
    { href: '#contact', label: dict.nav.contact },
  ];

  const otherLocale = locale === 'en' ? 'ar' : 'en';

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#hero" className="nav-logo" onClick={(e) => handleNavClick(e, '#hero')}>
          <img src="/SeaGuard/logo.svg" alt={dict.nav.logoText} className="logo-img" />
        </a>

        <div className={`nav-links${menuOpen ? ' active' : ''}`} id="navLinks">
          {navItems.map(item => (
            <a key={item.href} href={item.href} className="nav-link" onClick={(e) => handleNavClick(e, item.href)}>
              {item.label}
            </a>
          ))}
          <Link href={`/${otherLocale}`} className="nav-link lang-toggle">
            {dict.nav.langToggle}
          </Link>
        </div>

        <button
          className={`nav-hamburger${menuOpen ? ' active' : ''}`}
          onClick={toggleMenu}
          aria-label={dict.nav.hamburgerLabel}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
