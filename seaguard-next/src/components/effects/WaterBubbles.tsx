'use client';

import { useEffect, useRef } from 'react';

export default function WaterBubbles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    const BUBBLE_COUNT = 35;
    const bubbles: HTMLDivElement[] = [];

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'water-bubble';
      const size = Math.random() * 20 + 4;
      const x = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 12;
      const wobble = Math.random() * 40 + 20;

      bubble.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        bottom: -${size}px;
        --wobble: ${wobble}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${Math.random() * 0.3 + 0.05};
      `;

      container.appendChild(bubble);
      bubbles.push(bubble);
    }

    // Scroll-driven parallax for bubbles
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          bubbles.forEach((b, i) => {
            const speed = 0.05 + (i % 5) * 0.02;
            b.style.transform = `translateY(${-scrollY * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      bubbles.forEach(b => b.remove());
    };
  }, []);

  return <div ref={containerRef} className="water-bubbles-container" />;
}
