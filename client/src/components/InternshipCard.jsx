import { Link } from 'react-router-dom';

export default function InternshipCard({ internship }) {
  if (!internship) return null;

  const { id, title, company, location, duration, stipend, mode, description, skills } =
    internship;

  return (
    <article className="internship-card">
      <div className="card-top">
        <div className="company-avatar" aria-hidden="true">
          {company ? company.charAt(0).toUpperCase() : 'I'}
        </div>
        <div className="card-top-info">
          <span className="mode-badge">{mode || 'Internship'}</span>
        </div>
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="card-company">{company}</p>

      <p className="card-description">
        {description && description.length > 120
          ? `${description.slice(0, 120)}...`
          : description}
      </p>

      <div className="card-meta">
        <span className="meta-item" title="Location">
          📍 {location}
        </span>
        <span className="meta-item" title="Duration">
          ⏱️ {duration}
        </span>
      </div>

      {skills && skills.length > 0 && (
        <div className="card-skills">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-pill">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="skill-pill-more">+{skills.length - 3}</span>
          )}
        </div>
      )}

      <div className="card-footer">
        <div className="stipend-box">
          <span className="stipend-amount">{stipend}</span>
          <span className="stipend-label">Stipend</span>
        </div>
        <Link to={`/internships/${id}`} className="button secondary">
          View Details →
        </Link>
      </div>
    </article>
  );
}
