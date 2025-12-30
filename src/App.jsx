import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Chatbot from './components/Chatbot';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {

  // SEO Updates
  useEffect(() => {
    document.title = "Leadsplatter | AI B2B Lead Generation";
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <header className="fade-in">
          <div className="logo-text">
            <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <span className="gradient-text">Leadsplatter</span>
            </Link>
          </div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/#features">Features</Link>
            <Link to="/#pricing">Pricing</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} Leadsplatter Inc. All rights reserved.</p>
        </footer>

        {/* Global Chatbot present on all pages */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
