import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as feedbackApi from '../../api/feedbacks';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    feedbackApi.getAll().then((data) => {
      setFeedbacks(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-lg ${star <= rating ? 'text-[#F7C948]' : 'text-white/20'}`}>★</span>
      ))}
    </div>
  );

  return (
    <div className="py-8" data-cy="feedback-list">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Klant Feedback</h1>
          <p className="text-white/60 mt-1">Wat onze klanten zeggen</p>
        </div>
        <button onClick={() => navigate('/feedback/addFeedback')} className="btn-primary text-sm" data-cy="add-feedback-button">
          + Feedback Geven
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {feedbacks
          .sort((a, b) => new Date(b.datum) - new Date(a.datum))
          .map((fb) => (
            <div
              key={fb.feedbackID}
              onClick={() => navigate(`/feedback/${fb.feedbackID}`)}
              className="card cursor-pointer"
              data-cy="feedback"
            >
              <StarRating rating={fb.rating} />
              <p className="text-white mt-3 line-clamp-3">{fb.omschrijving}</p>
              <p className="text-white/40 text-sm mt-4">{fb.datum}</p>
            </div>
          ))}
      </div>

      {feedbacks.length === 0 && (
        <div className="card text-center py-12 text-white/40">Nog geen feedback</div>
      )}
    </div>
  );
}
