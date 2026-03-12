'use client';

import { useEffect, useState } from 'react';

export default function Preloader({ text }: { text: string }) {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHidden(true), 1500);
    const t2 = setTimeout(() => setRemoved(true), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (removed) return null;

  return (
    <div id="preloader" className={`preloader${hidden ? ' hidden' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-wave">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <p className="preloader-text">{text}</p>
      </div>
    </div>
  );
}
