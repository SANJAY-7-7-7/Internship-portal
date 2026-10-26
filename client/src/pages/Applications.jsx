import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to retrieve applications from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <main className="page-container">
      <div className="section-header">
        <div>
          <span className="section-tag">DATABASE RECORDS</span>
          <h1 className="section-title">Submitted Applications</h1>
          <p className="section-subtitle">
            Live database view of all student applications stored in MongoDB.
          </p>
        </div>
        <button
          onClick={loadApplications}
          className="button secondary"
          disabled={loading}
          aria-label="Refresh application list"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh List'}
        </button>
      </div>

      {loading && (
        <div className="state-card loading-state">
          <div className="spinner"></div>
          <p>Querying applications from MongoDB...</p>
        </div>
      )}

      {error && (
        <div className="state-card error-state" role="alert">
          <div className="state-icon">⚠️</div>
          <h3>Failed to Retrieve Applications</h3>
          <p>{error}</p>
          <button onClick={loadApplications} className="button secondary">
            Retry Query
          </button>
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="state-card empty-state">
          <div className="state-icon">📭</div>
          <h3>No Applications Stored Yet</h3>
          <p>
            No student has applied for any internship position yet. Be the first to
            submit an application!
          </p>
          <Link to="/" className="button primary">
            Browse Internships
          </Link>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Student Name</th>
                <th scope="col">Roll Number</th>
                <th scope="col">Email Address</th>
                <th scope="col">Selected Internship</th>
                <th scope="col">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app._id || index}>
                  <td className="table-index">{index + 1}</td>
                  <td>
                    <strong className="student-name">{app.studentName}</strong>
                    <div className="app-id-subtext">ID: {app._id}</div>
                  </td>
                  <td>
                    <span className="roll-badge">{app.rollNumber}</span>
                  </td>
                  <td>
                    <a href={`mailto:${app.email}`} className="table-email">
                      {app.email}
                    </a>
                  </td>
                  <td>
                    <div className="internship-title-cell">
                      {app.internshipTitle || 'Internship'}
                    </div>
                    {app.company && (
                      <div className="company-subtext">{app.company}</div>
                    )}
                  </td>
                  <td className="date-cell">{formatDate(app.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
