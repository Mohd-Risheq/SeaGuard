export default function WaveDivider({ flip = false }: { flip?: boolean }) {
  const path = flip
    ? "M0,60 C360,0 720,120 1080,60 C1260,30 1380,40 1440,60 L1440,120 L0,120 Z"
    : "M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z";
  const fill = flip ? "var(--deep-ocean)" : "var(--ocean-dark)";

  return (
    <div className={`wave-divider${flip ? ' wave-flip' : ''}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d={path} fill={fill} />
      </svg>
    </div>
  );
}
