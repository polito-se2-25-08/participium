import { useNavigate } from 'react-router-dom';
import ReportForm from '../components/ReportForm';
import './ReportPage.css';

const ReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="report-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>
      <ReportForm />
    </div>
  );
};

export default ReportPage;
