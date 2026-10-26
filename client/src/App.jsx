import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import InternshipList from './pages/InternshipList';
import InternshipDetails from './pages/InternshipDetails';
import Applications from './pages/Applications';
import './App.css';

function NotFound() {
  return (
    <main className="page-container state-card empty-state not-found-page">
      <div className="state-icon">🧭</div>
      <h1>404 — Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="button primary">
        Back to Home
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<InternshipList />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-badge">IS</span>
            <span className="brand-text">
              Intern<span className="brand-highlight">Sphere</span>
            </span>
          </div>
          <p className="footer-tagline">
            ByteXL Student Internship Portal — Empowering careers through industry experience.
          </p>
          <div className="footer-links">
            <Link to="/">Internships</Link>
            <Link to="/applications">My Applications</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
