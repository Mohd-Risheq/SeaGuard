interface FleetSectionProps {
  dict: any;
}

const boatSvgs = [
  // Yasmena - single mast with sail
  <svg key="yasmena" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path d="M8 40l6-16h36l6 16" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 40c8 8 16 8 28 4s20-4 28 0" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 24V12" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 12l12 8" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // Alissar - Phoenician style with two masts and flag
  <svg key="alissar" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path d="M8 40l6-16h36l6 16" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 40c8 8 16 8 28 4s20-4 28 0" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 24V8" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 24V12" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 8h8v4h-8z" fill="var(--coral)" opacity="0.6"/>
  </svg>,
  // Barakah - cabin style with porthole
  <svg key="barakah" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <path d="M8 40l6-16h36l6 16" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 40c8 8 16 8 28 4s20-4 28 0" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 24V16h24v8" stroke="var(--teal-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="20" r="2" fill="var(--coral)"/>
  </svg>,
];

export default function FleetSection({ dict }: FleetSectionProps) {
  return (
    <section className="section fleet-section" id="fleet">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.fleet.label}</span>
          <h2 className="section-title">{dict.fleet.title}</h2>
          <div className="section-line"></div>
        </div>

        <div className="fleet-grid">
          {dict.fleet.boats.map((boat: any, i: number) => (
            <div className="fleet-card glass-card" key={i}>
              <div className="fleet-image-placeholder">
                {boatSvgs[i]}
              </div>
              <div className="fleet-info">
                <span className="fleet-year">{boat.year}</span>
                <h3>{boat.name}</h3>
                <p>{boat.description}</p>
                <div className="fleet-tags">
                  {boat.tags.map((tag: string, j: number) => (
                    <span className="tag" key={j}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
