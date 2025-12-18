import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as feedbackApi from '../../api/feedbacks';

export default function AddFeedback() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ verhuurID: '', omschrijving: '', rating: 5 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await feedbackApi.addFeedback({
      verhuurID: Number(form.verhuurID),
      omschrijving: form.omschrijving,
      rating: form.rating,
      datum: new Date().toISOString().slice(0, 10),
    });
    navigate('/feedback');
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Feedback Geven</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Verhuur ID</label>
          <input
            type="number"
            value={form.verhuurID}
            onChange={(e) => setForm({ ...form, verhuurID: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-3xl transition-transform hover:scale-110 ${star <= form.rating ? 'text-[#F7C948]' : 'text-white/20'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Omschrijving</label>
          <textarea
            value={form.omschrijving}
            onChange={(e) => setForm({ ...form, omschrijving: e.target.value })}
            className="input-field min-h-[120px]"
            placeholder="Deel je ervaring..."
            required
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn-primary flex-1">Versturen</button>
          <button type="button" onClick={() => navigate('/feedback')} className="btn-secondary flex-1">Annuleren</button>
        </div>
      </form>
    </div>
  );
}
