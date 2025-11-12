import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, ReportPage, LoginPage, UserProfilePage, AdminDashboard } from './pages';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
