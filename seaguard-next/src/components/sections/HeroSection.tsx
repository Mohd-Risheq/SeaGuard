'use client';

import dynamic from 'next/dynamic';

const OceanCanvas = dynamic(() => import('@/components/three/OceanCanvas'), { ssr: false });

export default function HeroSection({ dict }: { dict: any }) {
  return (
    <section className="hero" id="hero">
      <OceanCanvas />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-line">{dict.hero.title}</span>
        </h1>
        <p className="hero-subtitle">{dict.hero.subtitle}</p>
        <p className="hero-tagline">{dict.hero.tagline}</p>
        <a href="#pricing" className="hero-cta">
          <span>{dict.hero.cta}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <div className="hero-scroll-indicator">
        <span className="scroll-text">{dict.hero.scrollText}</span>
        <div className="scroll-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
