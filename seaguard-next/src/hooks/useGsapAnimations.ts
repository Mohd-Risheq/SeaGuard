'use client';

import { useEffect } from 'react';

export function useGsapAnimations() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let gsapModule: any;
    let ScrollTriggerModule: any;

    import('gsap').then((mod) => {
      gsapModule = mod.default;
      return import('gsap/ScrollTrigger');
    }).then((mod) => {
      ScrollTriggerModule = mod.default;
      gsapModule.registerPlugin(ScrollTriggerModule);
      initAnimations(gsapModule, ScrollTriggerModule);
    });

    function initAnimations(gsap: any, ScrollTrigger: any) {
      // ========================================
      // Hero — Clean cinematic entrance
      // ========================================
      const heroTl = gsap.timeline({ delay: 0.3 });
      heroTl
        .from('.hero-tagline', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.hero-title-word', { y: 80, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }, '-=0.4')
        .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .from('.hero-scroll-indicator', { opacity: 0, y: 20, duration: 1 }, '-=0.2');

      // Hero parallax on scroll
      gsap.to('.hero-content', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 120, opacity: 0, ease: 'none',
      });

      gsap.to('.hero-glow', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 60, scale: 1.3, opacity: 0, ease: 'none',
      });

      // ========================================
      // Section headers — Dramatic reveals
      // ========================================
      gsap.utils.toArray('.section-header').forEach((header: Element) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
        tl.from(header.querySelector('.section-label'), { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' })
          .from(header.querySelector('.section-title'), { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
          .from(header.querySelector('.section-line'), { scaleX: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      });

      // ========================================
      // Aqaba Bay — Staggered reveals
      // ========================================
      gsap.from('.aqaba-text p', {
        scrollTrigger: { trigger: '.aqaba-intro', start: 'top 80%', toggleActions: 'play none none reverse' },
        x: -60, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
      });

      gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.aqaba-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 50, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.15, ease: 'back.out(1.5)',
      });

      gsap.from('.dive-site-featured', {
        scrollTrigger: { trigger: '.dive-site-featured', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      });

      gsap.from('.dive-site-card', {
        scrollTrigger: { trigger: '.dive-site-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, scale: 0.92, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      });

      // ========================================
      // About — Cinematic entrance
      // ========================================
      gsap.from('.about-image', {
        scrollTrigger: { trigger: '.about-content', start: 'top 80%', toggleActions: 'play none none reverse' },
        x: -100, opacity: 0, rotation: -5, duration: 1.2, ease: 'power3.out',
      });

      gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about-content', start: 'top 80%', toggleActions: 'play none none reverse' },
        x: 100, opacity: 0, duration: 1.2, ease: 'power3.out',
      });

      gsap.utils.toArray('.timeline-item').forEach((item: Element, i: number) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none reverse' },
          x: i % 2 === 0 ? -50 : 50, opacity: 0, duration: 0.7, ease: 'power3.out',
        });
      });

      gsap.from('.padi-section', {
        scrollTrigger: { trigger: '.padi-section', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      });

      // ========================================
      // Fleet — 3D card reveals
      // ========================================
      gsap.utils.toArray('.fleet-card').forEach((card: Element, i: number) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 80, opacity: 0, rotationY: i % 2 === 0 ? -10 : 10, duration: 1, ease: 'power3.out',
        });
      });

      // ========================================
      // Pricing — Pop-in with bounce
      // ========================================
      gsap.from('.pricing-card', {
        scrollTrigger: { trigger: '.pricing-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, scale: 0.85, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)',
      });

      // ========================================
      // Experience — Step-by-step reveal
      // ========================================
      gsap.utils.toArray('.experience-step').forEach((step: Element) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
        const num = step.querySelector('.step-number');
        const content = step.querySelector('.step-content');
        if (num) tl.from(num, { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
        if (content) tl.from(content, { x: 60, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2');
      });

      gsap.from('.trust-badge', {
        scrollTrigger: { trigger: '.trust-badges', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 30, opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.1, ease: 'back.out(2)',
      });

      // ========================================
      // Reviews — Fade-slide with stagger
      // ========================================
      gsap.from('.review-card', {
        scrollTrigger: { trigger: '.reviews-carousel', start: 'top 85%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, rotationX: 10, duration: 0.9, stagger: 0.15, ease: 'power3.out',
      });

      // ========================================
      // Contact — Split reveal
      // ========================================
      gsap.from('.contact-item', {
        scrollTrigger: { trigger: '.contact-info', start: 'top 85%', toggleActions: 'play none none reverse' },
        x: -50, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      gsap.from('.contact-form-wrapper', {
        scrollTrigger: { trigger: '.contact-form-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
        x: 80, opacity: 0, duration: 1, ease: 'power3.out',
      });

      gsap.from('.social-links', {
        scrollTrigger: { trigger: '.social-links', start: 'top 90%', toggleActions: 'play none none reverse' },
        y: 30, opacity: 0, duration: 0.6, ease: 'power3.out',
      });

      // ========================================
      // Numbers — Counter-like bounce
      // ========================================
      gsap.utils.toArray('.stat-number').forEach((num: Element) => {
        gsap.from(num, {
          scrollTrigger: { trigger: num, start: 'top 90%', toggleActions: 'play none none reverse' },
          scale: 0.3, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.4)',
        });
      });

      gsap.utils.toArray('.price-amount').forEach((el: Element) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
          scale: 0.3, opacity: 0, duration: 0.8, ease: 'back.out(3)',
        });
      });

      // ========================================
      // Glass card hover glow — CSS driven, but add subtle GSAP parallax
      // ========================================
      gsap.utils.toArray('.glass-card').forEach((card: Element) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -10,
          ease: 'none',
        });
      });

      // ========================================
      // Wave dividers — Subtle parallax
      // ========================================
      gsap.utils.toArray('.wave-divider').forEach((wave: Element) => {
        gsap.to(wave, {
          scrollTrigger: {
            trigger: wave,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: -15,
          ease: 'none',
        });
      });
    }

    return () => {
      if (ScrollTriggerModule) {
        ScrollTriggerModule.getAll().forEach((t: any) => t.kill());
      }
      if (gsapModule) {
        gsapModule.killTweensOf('*');
      }
    };
  }, []);
}
