'use client';

import dynamic from 'next/dynamic';

const OceanCanvas = dynamic(() => import('@/components/three/OceanCanvas'), { ssr: false });

export default function HeroSection({ dict }: { dict: any }) {
  return (
    <section className="hero" id="hero">
      <OceanCanvas />
      <div className="hero-overlay"></div>

      {/* Ambient glow behind content */}
      <div className="hero-glow"></div>

      <div className="hero-content">
        <p className="hero-tagline">{dict.hero.tagline}</p>
        <h1 className="hero-title">
          <span className="hero-title-word">{dict.hero.title.split(' ')[0]}</span>
          <span className="hero-title-word hero-title-accent">{dict.hero.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="hero-subtitle">{dict.hero.subtitle}</p>
        <a href="#pricing" className="hero-cta">
          <span>{dict.hero.cta}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span className="scroll-text">{dict.hero.scrollText}</span>
      </div>
    </section>
  );
}
