// // src/pages/feedback/FeedbackDetail.jsx
// import { useParams } from 'react-router-dom';
// import { FEEDBACK_DATA } from '../../api/mock_data';

// const FeedbackDetail = () => {
//   const { id } = useParams();
//   const feedbackID = Number(id);
//   console.log(`Feedback ID from URL: ${feedbackID}`);

//   const feedback = FEEDBACK_DATA.find((f) => f.feedbackID === feedbackID);

//   if (!feedback) {
//     return (
//       <div>
//         <h1>Feedback niet gevonden</h1>
//         <p>Er is geen feedback met ID {id}.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Feedback Detail</h1>
//       <p><strong>Verhuur ID:</strong> {feedback.verhuurID}</p>
//       <p><strong>Omschrijving:</strong> {feedback.omschrijving}</p>
//       <p><strong>Datum:</strong> {feedback.datum}</p>
//       <p><strong>Rating:</strong> {feedback.rating}</p>
//     </div>
//   );
// };

// export default FeedbackDetail;
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as feedbackApi from '../../api/feedbacks';
import './FeedbackDetail.css';
import { useTheme } from '../../contexts/theme';

const FeedbackDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const feedbackID = Number(id);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const feedbackData = await feedbackApi.getById(feedbackID);
        setFeedback(feedbackData);
      } catch (err) {
        setError('Failed to load feedback');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [feedbackID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!feedback) {
    return (
      <div className={`feedbackdetail-container theme-${theme}`}>
        <h1 className={`detail-title theme-${theme}`}>Feedback niet gevonden</h1>
        <p>Er is geen feedback met ID {id}.</p>
      </div>
    );
  }

  return (
    <div className={`feedbackdetail-container theme-${theme}`}> 
      <h2 className="feedbackdetail-title">Feedback detail</h2>
      <div className="feedbackdetail-info">
        <p><strong>Verhuur ID:</strong> {feedback.verhuurID}</p>
        <p><strong>Omschrijving:</strong> {feedback.omschrijving}</p>
        <p><strong>Datum:</strong> {feedback.datum}</p>
        <p><strong>Rating:</strong> {feedback.rating}</p>
      </div>
      {/* ...knoppen... */}
    </div>
  );
};

export default FeedbackDetail;