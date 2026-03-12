export default function Footer({ dict }: { dict: any }) {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,40 C240,100 480,0 720,60 C960,120 1200,20 1440,60 L1440,0 L0,0 Z" fill="var(--ocean-dark)" opacity="0.3"/>
        </svg>
      </div>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/SeaGuard/logo.svg" alt={dict.footer.brand.name} className="footer-logo" />
            <p>{dict.footer.brand.description}</p>
          </div>
          <div className="footer-links">
            <h4>{dict.footer.links.title}</h4>
            <a href="#aqaba">{dict.footer.links.items[0]}</a>
            <a href="#about">{dict.footer.links.items[1]}</a>
            <a href="#fleet">{dict.footer.links.items[2]}</a>
            <a href="#pricing">{dict.footer.links.items[3]}</a>
            <a href="#contact">{dict.footer.links.items[4]}</a>
          </div>
          <div className="footer-contact">
            <h4>{dict.footer.visitUs.title}</h4>
            <p>{dict.footer.visitUs.street}</p>
            <p>{dict.footer.visitUs.city}</p>
            <p className="footer-site">{dict.footer.visitUs.site}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
