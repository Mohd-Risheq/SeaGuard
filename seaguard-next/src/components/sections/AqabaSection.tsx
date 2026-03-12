interface AqabaSectionProps {
  dict: any;
}

export default function AqabaSection({ dict }: AqabaSectionProps) {
  return (
    <section className="section aqaba-section" id="aqaba">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.aqaba.label}</span>
          <h2 className="section-title">{dict.aqaba.title}</h2>
          <div className="section-line"></div>
        </div>

        <div className="aqaba-intro">
          <div className="aqaba-text">
            <p>{dict.aqaba.intro1}</p>
            <p>{dict.aqaba.intro2}</p>
          </div>
          <div className="aqaba-stats">
            {dict.aqaba.stats.map((stat: any, i: number) => (
              <div className="stat-card glass-card" key={i}>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dive Sites */}
        <div className="dive-sites">
          <h3 className="subsection-title">{dict.aqaba.diveSitesTitle}</h3>

          <div className="dive-site-featured glass-card">
            <div className="dive-site-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="var(--teal-light)" strokeWidth="1.5"/>
                <path d="M16 28c2-4 4-6 8-6s6 2 8 6" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="2" fill="var(--teal-light)"/>
                <circle cx="28" cy="20" r="2" fill="var(--teal-light)"/>
                <path d="M14 32c4 2 8 3 12 2s6-2 8-4" stroke="var(--coral)" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
              </svg>
            </div>
            <div className="dive-site-content">
              <h4>{dict.aqaba.featured.name}</h4>
              <span className="dive-site-tag">{dict.aqaba.featured.tag}</span>
              <p>{dict.aqaba.featured.description}</p>
            </div>
          </div>

          <div className="dive-site-grid">
            {dict.aqaba.sites.map((site: any, i: number) => (
              <div className="dive-site-card glass-card" key={i}>
                <div className="dive-site-depth">{site.depth}</div>
                <h4>{site.name}</h4>
                <p>{site.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
