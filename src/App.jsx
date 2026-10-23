import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Homepage from './pages/Homepage';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import MedicalReportForm from './pages/Report';
import HealthPlanDashboard from './pages/HealthcareReport';
import ErrorBoundary from './components/ErrorBoundary';

// Start each route at the top of the page (in-page #hash links still work).
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/medicalreport" element={<MedicalReportForm />} />
        <Route path="/healthcareplan" element={<ErrorBoundary><HealthPlanDashboard /></ErrorBoundary>} />
      </Routes>
    </>
  );
}

export default App;
