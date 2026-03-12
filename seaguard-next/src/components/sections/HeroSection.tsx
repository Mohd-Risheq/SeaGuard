'use client';

import dynamic from 'next/dynamic';

const OceanCanvas = dynamic(() => import('@/components/three/OceanCanvas'), { ssr: false });
const ParticleField = dynamic(() => import('@/components/effects/ParticleField'), { ssr: false });

export default function HeroSection({ dict }: { dict: any }) {
  return (
    <section className="hero" id="hero">
      <OceanCanvas />
      <ParticleField />
      <div className="hero-overlay"></div>

      {/* Animated depth layers */}
      <div className="hero-depth-layer hero-depth-1"></div>
      <div className="hero-depth-layer hero-depth-2"></div>
      <div className="hero-depth-3">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L0,320Z" fill="rgba(10,22,40,0.4)"/>
        </svg>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span>PADI Certified Since 2000</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-title-line hero-title-main">{dict.hero.title}</span>
        </h1>
        <p className="hero-subtitle">{dict.hero.subtitle}</p>
        <p className="hero-tagline">{dict.hero.tagline}</p>
        <div className="hero-cta-group">
          <a href="#pricing" className="hero-cta">
            <span>{dict.hero.cta}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#aqaba" className="hero-cta-secondary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Explore</span>
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line"></div>
        <span className="scroll-text">{dict.hero.scrollText}</span>
      </div>

      {/* Floating decorative elements */}
      <div className="hero-float hero-float-1">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.1">
          <circle cx="30" cy="30" r="28" stroke="var(--teal-light)" strokeWidth="1"/>
          <circle cx="30" cy="30" r="18" stroke="var(--teal-light)" strokeWidth="0.5"/>
        </svg>
      </div>
      <div className="hero-float hero-float-2">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.08">
          <path d="M20 2L38 20L20 38L2 20Z" stroke="var(--coral)" strokeWidth="1"/>
        </svg>
      </div>
    </section>
  );
}
