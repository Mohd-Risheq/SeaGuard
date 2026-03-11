export function initAnimations() {
  // Wait for GSAP to be available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // --- Hero animations ---
  const heroTl = gsap.timeline({ delay: 0.5 });
  heroTl
    .from('.hero-title', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
    .from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero-tagline', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 1 }, '-=0.2');

  // --- Section headers ---
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.children, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  });

  // --- Aqaba Bay ---
  gsap.from('.aqaba-text', {
    scrollTrigger: { trigger: '.aqaba-intro', start: 'top 80%', toggleActions: 'play none none reverse' },
    x: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.stat-card', {
    scrollTrigger: { trigger: '.aqaba-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
  });

  gsap.from('.dive-site-featured', {
    scrollTrigger: { trigger: '.dive-site-featured', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.from('.dive-site-card', {
    scrollTrigger: { trigger: '.dive-site-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 50,
    opacity: 0,
    scale: 0.95,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // --- About ---
  gsap.from('.about-image', {
    scrollTrigger: { trigger: '.about-content', start: 'top 80%', toggleActions: 'play none none reverse' },
    x: -80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about-content', start: 'top 80%', toggleActions: 'play none none reverse' },
    x: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none reverse' },
      x: i % 2 === 0 ? -40 : 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  });

  gsap.from('.padi-section', {
    scrollTrigger: { trigger: '.padi-section', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  // --- Fleet ---
  gsap.utils.toArray('.fleet-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: i % 2 === 0 ? -60 : 60,
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // --- Pricing ---
  gsap.from('.pricing-card', {
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 50,
    opacity: 0,
    rotation: 2,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // --- Experience steps ---
  gsap.utils.toArray('.experience-step').forEach(step => {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none reverse' },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
  });

  // Step numbers counter effect
  gsap.utils.toArray('.step-number').forEach(num => {
    gsap.to(num, {
      scrollTrigger: { trigger: num, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  // Trust badges
  gsap.from('.trust-badge', {
    scrollTrigger: { trigger: '.trust-badges', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 30,
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // --- Reviews ---
  gsap.from('.review-card', {
    scrollTrigger: { trigger: '.reviews-carousel', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // --- Contact ---
  gsap.from('.contact-item', {
    scrollTrigger: { trigger: '.contact-info', start: 'top 85%', toggleActions: 'play none none reverse' },
    x: -40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
  });

  gsap.from('.contact-form-wrapper', {
    scrollTrigger: { trigger: '.contact-form-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
    x: 60,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  });

  gsap.from('.social-links', {
    scrollTrigger: { trigger: '.social-links', start: 'top 90%', toggleActions: 'play none none reverse' },
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  });

  // --- Parallax on stat numbers ---
  gsap.utils.toArray('.stat-number').forEach(num => {
    gsap.from(num, {
      scrollTrigger: { trigger: num, start: 'top 90%', toggleActions: 'play none none reverse' },
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    });
  });

  // --- Price amount animation ---
  gsap.utils.toArray('.price-amount').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)',
    });
  });
}
