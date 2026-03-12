interface AboutSectionProps {
  dict: any;
}

export default function AboutSection({ dict }: AboutSectionProps) {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.about.label}</span>
          <h2 className="section-title">{dict.about.title}</h2>
          <div className="section-line"></div>
        </div>

        <div className="about-content">
          <div className="about-image">
            <div className="about-image-placeholder">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="30" r="14" stroke="var(--teal-light)" strokeWidth="2"/>
                <path d="M16 65c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="var(--teal-light)" strokeWidth="2"/>
              </svg>
              <span>{dict.about.founderName}</span>
              <span className="about-badge">{dict.about.founderBadge}</span>
            </div>
          </div>

          <div className="about-text">
            <p className="about-lead">{dict.about.lead}</p>
            <p>{dict.about.text1}</p>
            <p>{dict.about.text2}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          <div className="timeline-line"></div>
          {dict.about.timeline.map((item: any, i: number) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-dot"></div>
              <div className="timeline-content glass-card">
                <span className="timeline-year">{item.year}</span>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PADI Section */}
        <div className="padi-section glass-card">
          <div className="padi-badge">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="5" y="5" width="50" height="50" rx="10" stroke="var(--teal-light)" strokeWidth="2"/>
              <text x="30" y="38" textAnchor="middle" fill="var(--teal-light)" fontSize="16" fontWeight="bold" fontFamily="Inter">PADI</text>
            </svg>
          </div>
          <div className="padi-text">
            <h3>{dict.about.padi.title}</h3>
            <p>{dict.about.padi.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
