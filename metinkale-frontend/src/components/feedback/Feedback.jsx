// src/components/feedback/Feedback.jsx
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../../contexts/theme';

const Feedback = ({ feedbackID, omschrijving, datum, rating }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/feedback/${feedbackID}`);
  };

  const { theme } = useThemeColors();
  const themeColors = {
    dark: { bg: '#333', text: '#f8f9fa', border: '#007bff' },
    light: { bg: '#fff', text: '#222', border: '#007bff' },
  };
  const bgColor = themeColors[theme]?.bg;
  const textColor = themeColors[theme]?.text;
  const borderColor = themeColors[theme]?.border;

  return (
    <div
      className="feedback-item"
      style={{ background: bgColor, color: textColor, borderLeft: `4px solid ${borderColor}`, fontWeight: 500 }}
    >
      <div className="feedback-message" style={{color: textColor}}>{omschrijving}</div>
      <div className="feedback-date" style={{color: theme === 'dark' ? '#e0e0e0' : '#888'}}>{datum}</div>
      <div className="feedback-author" style={{color: theme === 'dark' ? '#90caf9' : '#007bff'}}>
        Rating:&nbsp;
        <span style={{color: rating >= 4 ? '#43a047' : rating >= 3 ? '#fbc02d' : '#e53935'}}>
          {rating} / 5
        </span>
      </div>
      <button className="btn btn-primary mt-2" onClick={handleViewDetails}>
        Bekijk details
      </button>
    </div>
  );
};

export default Feedback;