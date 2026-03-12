interface ReviewsSectionProps {
  dict: any;
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="var(--coral)">
      <path d="M10 1l2.5 5.5L18 7.5l-4 4 1 6-5-2.5-5 2.5 1-6-4-4 5.5-1z"/>
    </svg>
  );
}

export default function ReviewsSection({ dict }: ReviewsSectionProps) {
  return (
    <section className="section reviews-section" id="reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{dict.reviews.label}</span>
          <h2 className="section-title">{dict.reviews.title}</h2>
          <div className="section-line"></div>
        </div>

        <div className="reviews-carousel">
          {dict.reviews.items.map((review: any, i: number) => (
            <div className="review-card glass-card" key={i}>
              <div className="review-stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <StarIcon key={j} />
                ))}
              </div>
              <p className="review-text">{review.text}</p>
              <span className="review-author">{review.author}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
