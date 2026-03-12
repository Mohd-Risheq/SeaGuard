'use client';

import { FormEvent, useState } from 'react';

interface ContactSectionProps {
  dict: any;
}

export default function ContactSection({ dict }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(subject || 'Contact from Website');
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:info@c-guard.net?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.contact.label}</span>
          <h2 className="section-title">{dict.contact.title}</h2>
          <div className="section-line"></div>
          <p className="section-description">{dict.contact.description}</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item glass-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="var(--teal-light)" strokeWidth="1.5"/>
                <circle cx="12" cy="9" r="2.5" stroke="var(--teal-light)" strokeWidth="1.5"/>
              </svg>
              <div>
                <h4>{dict.contact.location.title}</h4>
                <p>{dict.contact.location.text}</p>
              </div>
            </div>

            <div className="contact-item glass-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="var(--teal-light)" strokeWidth="1.5"/>
              </svg>
              <div>
                <h4>{dict.contact.phone.title}</h4>
                <p>{dict.contact.phone.text}</p>
              </div>
            </div>

            <div className="contact-item glass-card">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--teal-light)" strokeWidth="1.5"/>
                <path d="M2 4l10 8 10-8" stroke="var(--teal-light)" strokeWidth="1.5"/>
              </svg>
              <div>
                <h4>{dict.contact.email.title}</h4>
                <p>{dict.contact.email.text}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a href="#" className="social-link glass-card" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link glass-card" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="var(--teal-light)" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="5" stroke="var(--teal-light)" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="var(--teal-light)"/>
                </svg>
              </a>
              <a href="#" className="social-link glass-card" aria-label="TripAdvisor">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="14" r="4" stroke="var(--teal-light)" strokeWidth="1.5"/>
                  <circle cx="16" cy="14" r="4" stroke="var(--teal-light)" strokeWidth="1.5"/>
                  <circle cx="8" cy="14" r="1.5" fill="var(--teal-light)"/>
                  <circle cx="16" cy="14" r="1.5" fill="var(--teal-light)"/>
                  <path d="M4 10c2.667-2 5.333-3 8-3s5.333 1 8 3" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </a>
              <a href="#" className="social-link glass-card" aria-label="Google Reviews">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3 6.5 7 1-5 4.5 1.5 7L12 17.5 5.5 21 7 14 2 9.5l7-1z" stroke="var(--teal-light)" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="contact-form-wrapper glass-card">
            <h3>{dict.contact.form.title}</h3>
            <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder={dict.contact.form.name}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder={dict.contact.form.email}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder={dict.contact.form.subject}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder={dict.contact.form.message}
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="form-submit">
                <span>{dict.contact.form.submit}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
