import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as feedbackApi from '../../api/feedbacks';

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackApi.getById(Number(id)).then((data) => {
      setFeedback(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;
  if (!feedback) return <div className="text-center py-12 text-white/40">Feedback niet gevonden</div>;

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-2xl ${star <= rating ? 'text-[#F7C948]' : 'text-white/20'}`}>★</span>
      ))}
    </div>
  );

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate('/feedback')} className="text-white/60 hover:text-white mb-6">
        ← Terug naar feedback
      </button>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold gradient-text">Feedback Detail</h1>
          <StarRating rating={feedback.rating} />
        </div>

        <div className="space-y-4">
          <div className="py-3 border-b border-white/10">
            <span className="text-white/60 text-sm">Omschrijving</span>
            <p className="text-white mt-1">{feedback.omschrijving}</p>
          </div>
          <div className="flex justify-between py-3 border-b border-white/10">
            <span className="text-white/60">Datum</span>
            <span className="text-white">{feedback.datum}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-white/60">Verhuur ID</span>
            <span className="text-white">{feedback.verhuurID}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
