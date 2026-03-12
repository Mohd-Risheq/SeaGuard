interface PricingSectionProps {
  dict: any;
}

const serviceSvgs = [
  // Snorkeling Full Day
  <svg key="snorkeling" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16z" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <path d="M12 24c2-2 4-4 8-4s6 2 8 4" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 10v6" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // First Dive Experience
  <svg key="first-dive" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M20 4v8m0 0l-4-2m4 2l4-2" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="22" r="10" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <path d="M16 22h8" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 18v8" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // Two Dives / Day
  <svg key="two-dives" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M14 8v6m12-6v6" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="24" r="8" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <circle cx="26" cy="24" r="8" stroke="var(--teal-light)" strokeWidth="1.5"/>
  </svg>,
  // Two Dives + Equipment
  <svg key="two-dives-equip" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="12" width="24" height="18" rx="3" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <path d="M14 12V8m12 4V8" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 22h12m-12 4h8" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // Sunset Experience
  <svg key="sunset" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="16" r="8" stroke="var(--coral)" strokeWidth="1.5"/>
    <path d="M20 24v8" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 36c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="var(--coral)" strokeWidth="1.5"/>
  </svg>,
  // Private Tour
  <svg key="private" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path d="M8 20l6-12h12l6 12" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 20c8 8 12 8 16 4s8-4 16 0" stroke="var(--coral)" strokeWidth="1.5"/>
    <path d="M20 8v-4m-6 2l1 2m12-2l-1 2" stroke="var(--coral)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // Equipment Rental
  <svg key="equipment" width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="12" y="6" width="16" height="28" rx="4" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <circle cx="20" cy="16" r="4" stroke="var(--teal-light)" strokeWidth="1.5"/>
    <path d="M16 26h8" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
];

export default function PricingSection({ dict }: PricingSectionProps) {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.pricing.label}</span>
          <h2 className="section-title">{dict.pricing.title}</h2>
          <div className="section-line"></div>
          <p className="section-description">{dict.pricing.description}</p>
        </div>

        <div className="pricing-grid">
          {dict.pricing.services.map((service: any, i: number) => (
            <div
              className={`pricing-card glass-card${service.popular ? ' popular' : ''}${service.equipment ? ' equipment-card' : ''}`}
              key={i}
            >
              {service.popular && (
                <div className="popular-badge">{service.popularBadge}</div>
              )}
              <div className="pricing-icon">
                {serviceSvgs[i]}
              </div>
              <h3>{service.name}</h3>
              <p className="pricing-desc">{service.description}</p>
              <div className="pricing-price">
                <span className="price-amount">{service.price}</span>
                <span className="price-currency">{service.currency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
