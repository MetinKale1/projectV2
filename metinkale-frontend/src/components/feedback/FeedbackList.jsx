// ...existing code...
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as feedbackApi from '../../api/feedbacks';
import Feedback from './Feedback';
import { useThemeColors } from '../../contexts/theme';
import './FeedbackList.css';

const FeedbackList = () => {
  const { theme, textTheme } = useThemeColors();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacksData = await feedbackApi.getAll();
        setFeedbacks(feedbacksData);
      } catch (err) {
        setError('Failed to load feedbacks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const navigateToAddFeedback = () => {
    navigate('/feedback/addFeedback');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Dynamische kleuren voor thema
  // Theme class for CSS
  const themeClass = theme === 'dark' ? 'theme-dark' : 'theme-light';
  // Dynamische kleuren voor thema
  // Theme kleuren uit context
  const themeColors = {
    dark: { bg: '#222', text: '#f8f9fa' },
    light: { bg: '#f8f9fa', text: '#222' },
  };
  const bgColor = themeColors[theme]?.bg;
  const textColor = themeColors[theme]?.text;

  return (
    <div
      className={`feedback-list-container ${themeClass}`}
      data-cy="feedback-list"
      style={{ background: bgColor, color: textColor }}
    >
      <h2 className={`feedback-list-title ${themeClass}`}>Customer Feedback</h2>
      <button className="btn btn-primary mb-4" onClick={navigateToAddFeedback} data-cy="add-feedback-button">
        Add Feedback
      </button>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">
        {feedbacks
          .sort((a, b) => new Date(b.datum) - new Date(a.datum))
          .map((feedback) => (
            <div className="col" key={feedback.feedbackID} data-cy="feedback">
              <Feedback {...feedback} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default FeedbackList;