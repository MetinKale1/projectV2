import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as verhuurApi from '../../api/verhuur';

export default function HuurFiets() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uitleendatum, setUitleendatum] = useState(new Date().toISOString().slice(0, 10));
  const [inleverdatum, setInleverdatum] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.klantID) {
      setMessage('Je moet ingelogd zijn om te huren.');
      return;
    }
    setLoading(true);
    try {
      await verhuurApi.addVerhuur({
        klantID: user.klantID,
        fietsID: parseInt(id, 10),
        uitleendatum,
        inleverdatum,
      });
      setMessage('Verhuur succesvol aangemaakt!');
      setTimeout(() => navigate('/verhuur'), 1500);
    } catch {
      setMessage('Verhuur aanmaken mislukt.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <button onClick={() => navigate(`/fietsen/${id}`)} className="text-white/60 hover:text-white mb-6">
        ← Terug naar fiets
      </button>

      <div className="card">
        <h1 className="font-display text-2xl font-bold gradient-text mb-6">Fiets #{id} Huren</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Uitleendatum</label>
            <input
              type="date"
              value={uitleendatum}
              onChange={(e) => setUitleendatum(e.target.value)}
              className="input-field"
              required
              data-cy="uitleendatum_input"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Inleverdatum</label>
            <input
              type="date"
              value={inleverdatum}
              onChange={(e) => setInleverdatum(e.target.value)}
              className="input-field"
              required
              data-cy="inleverdatum_input"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl ${message.includes('succes') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
            data-cy="bevestig_verhuur_btn"
          >
            {loading ? 'Bezig...' : 'Bevestig Verhuur'}
          </button>
        </form>
      </div>
    </div>
  );
}
