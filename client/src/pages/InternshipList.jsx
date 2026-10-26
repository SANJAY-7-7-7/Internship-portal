import { useEffect, useState } from 'react';
import { getInternships } from '../api';
import InternshipCard from '../components/InternshipCard';

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInternships = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInternships();
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load internship opportunities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  return (
    <main className="page-container">
      {/* Hero Section */}
      <section className="hero-banner">
        <span className="hero-badge">BYTE-XL INTERNSHIP PROGRAM</span>
        <h1 className="hero-title">
          Launch Your Tech Career with <span>Real-World Experience</span>
        </h1>
        <p className="hero-subtitle">
          Browse verified internship listings, learn in-demand skills, and apply directly to forward-thinking tech companies.
        </p>
        <div className="hero-actions">
          <a href="#available-internships" className="button primary">
            Explore Opportunities ↓
          </a>
        </div>
      </section>

      {/* Internships Section */}
      <section className="catalog-section" id="available-internships">
        <div className="section-header">
          <div>
            <span className="section-tag">OPEN ROLES</span>
            <h2 className="section-title">Available Internships</h2>
          </div>
          {!loading && !error && (
            <span className="count-pill">{internships.length} Positions Available</span>
          )}
        </div>

        {loading && (
          <div className="state-card loading-state">
            <div className="spinner"></div>
            <p>Loading available internship opportunities...</p>
          </div>
        )}

        {error && (
          <div className="state-card error-state" role="alert">
            <div className="state-icon">⚠️</div>
            <h3>Unable to Load Internships</h3>
            <p>{error}</p>
            <button onClick={loadInternships} className="button secondary">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && internships.length === 0 && (
          <div className="state-card empty-state">
            <div className="state-icon">📋</div>
            <h3>No Active Internships Found</h3>
            <p>Please check back later as new positions are posted regularly.</p>
          </div>
        )}

        {!loading && !error && internships.length > 0 && (
          <div className="internship-grid">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
