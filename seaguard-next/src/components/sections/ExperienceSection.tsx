interface ExperienceSectionProps {
  dict: any;
}

const badgeSvgs = [
  // PADI Certified
  <svg key="padi" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="4" width="24" height="24" rx="6" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <text x="16" y="20" textAnchor="middle" fill="var(--teal-light)" fontSize="10" fontWeight="bold" fontFamily="Inter">PADI</text>
  </svg>,
  // 20+ Years Experience (star)
  <svg key="experience" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="var(--teal-light)" strokeWidth="1.5" fill="none"/>
  </svg>,
  // 12,000+ Dives (checkmark circle)
  <svg key="dives" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="10" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <path d="M12 16l3 3 5-6" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  // Small Groups
  <svg key="groups" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 6c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <circle cx="10" cy="20" r="4" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <circle cx="22" cy="20" r="4" stroke="var(--teal-light)" strokeWidth="1.5"/>
  </svg>,
];

export default function ExperienceSection({ dict }: ExperienceSectionProps) {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.experience.label}</span>
          <h2 className="section-title">{dict.experience.title}</h2>
          <div className="section-line"></div>
        </div>

        <div className="experience-steps">
          {dict.experience.steps.map((step: any, i: number) => (
            <div className="experience-step" key={i}>
              <div className="step-number">{step.number}</div>
              <div className="step-content glass-card">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          {dict.experience.badges.map((badge: any, i: number) => (
            <div className="trust-badge glass-card" key={i}>
              <span className="badge-icon">
                {badgeSvgs[i]}
              </span>
              <span className="badge-text">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
