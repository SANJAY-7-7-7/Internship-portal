import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInternshipById } from '../api';
import ApplicationForm from '../components/ApplicationForm';

export default function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInternshipById(id);
      setInternship(data);
    } catch (err) {
      setError(
        err.status === 404
          ? 'Internship not found. It may have expired or been removed.'
          : err.message || 'Failed to load internship details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  return (
    <main className="page-container">
      <div className="breadcrumb-nav">
        <Link to="/" className="back-link">
          ← Back to All Internships
        </Link>
      </div>

      {loading && (
        <div className="state-card loading-state">
          <div className="spinner"></div>
          <p>Loading internship specifications...</p>
        </div>
      )}

      {error && (
        <div className="state-card error-state" role="alert">
          <div className="state-icon">⚠️</div>
          <h3>Error Loading Details</h3>
          <p>{error}</p>
          <div className="state-actions">
            <button onClick={loadDetails} className="button secondary">
              Try Again
            </button>
            <Link to="/" className="button primary">
              Browse Other Internships
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && internship && (
        <div className="details-layout">
          {/* Left Column: Internship Info */}
          <article className="details-main-card">
            <header className="details-header">
              <div className="details-badge-group">
                <span className="mode-badge">{internship.mode || 'Internship'}</span>
                <span className="duration-badge">⏱️ {internship.duration}</span>
              </div>
              <h1 className="details-title">{internship.title}</h1>
              <p className="details-company">{internship.company}</p>
            </header>

            <div className="details-meta-grid">
              <div className="meta-box">
                <span className="meta-label">Location</span>
                <span className="meta-val">📍 {internship.location}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Duration</span>
                <span className="meta-val">📅 {internship.duration}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Monthly Stipend</span>
                <span className="meta-val stipend-highlight">{internship.stipend}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Work Mode</span>
                <span className="meta-val">💼 {internship.mode || 'Flexible'}</span>
              </div>
            </div>

            <section className="details-section">
              <h2>Role Overview</h2>
              <p className="details-text">{internship.description}</p>
            </section>

            {internship.skills && internship.skills.length > 0 && (
              <section className="details-section">
                <h2>Required Skills & Tech Stack</h2>
                <div className="skills-tag-cloud">
                  {internship.skills.map((skill, index) => (
                    <span key={index} className="skill-pill-large">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Right Column: Application Form */}
          <aside className="details-sidebar">
            <ApplicationForm internship={internship} />
          </aside>
        </div>
      )}
    </main>
  );
}
