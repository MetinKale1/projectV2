import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as verhuurApi from '../../api/verhuur';
import * as fietsApi from '../../api/fietsen';

export default function HuurFiets() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fiets, setFiets] = useState(null);
  const [uitleendatum, setUitleendatum] = useState(new Date().toISOString().slice(0, 10));
  const [inleverdatum, setInleverdatum] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingFiets, setFetchingFiets] = useState(true);

  // Haal fiets info op om status te checken
  useEffect(() => {
    const fetchFiets = async () => {
      try {
        const data = await fietsApi.getById(Number(id));
        setFiets(data);
        
        // Check of fiets beschikbaar is
        const status = data.status?.toLowerCase();
        if (status === 'verhuurd') {
          setMessage('Deze fiets is momenteel verhuurd en niet beschikbaar.');
        } else if (status === 'inactive') {
          setMessage('Deze fiets is niet beschikbaar voor verhuur.');
        }
      } catch (error) {
        setMessage('Kon fiets informatie niet ophalen.');
      } finally {
        setFetchingFiets(false);
      }
    };
    fetchFiets();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.klantID) {
      setMessage('Je moet ingelogd zijn om te huren.');
      return;
    }

    // Extra check op fiets status
    const status = fiets?.status?.toLowerCase();
    if (status === 'verhuurd') {
      setMessage('Deze fiets is momenteel verhuurd en niet beschikbaar.');
      return;
    }
    if (status === 'inactive') {
      setMessage('Deze fiets is niet beschikbaar voor verhuur.');
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
    } catch (error) {
      console.error('Verhuur error:', error);
      setMessage('Verhuur aanmaken mislukt. Deze fiets is mogelijk niet beschikbaar.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingFiets) {
    return (
      <div className="py-8 max-w-xl mx-auto">
        <div className="text-center text-white/60">Laden...</div>
      </div>
    );
  }

  // Als fiets niet beschikbaar is, toon melding en disable form
  const isAvailable = fiets?.status?.toLowerCase() === 'beschikbaar' || 
                      fiets?.status?.toLowerCase() === 'active';

  return (
    <div className="py-8 max-w-xl mx-auto">
      <button onClick={() => navigate(`/fietsen/${id}`)} className="text-white/60 hover:text-white mb-6">
        ← Terug naar fiets
      </button>

      <div className="card">
        <h1 className="font-display text-2xl font-bold gradient-text mb-6">
          {fiets?.model || `Fiets #${id}`} Huren
        </h1>

        {/* Toon fiets status info */}
        {fiets && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                fiets.status?.toLowerCase() === 'beschikbaar' || fiets.status?.toLowerCase() === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {fiets.status}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Uitleendatum</label>
            <input
              type="date"
              value={uitleendatum}
              onChange={(e) => setUitleendatum(e.target.value)}
              className="input-field"
              required
              disabled={!isAvailable}
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
              disabled={!isAvailable}
              data-cy="inleverdatum_input"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl ${
              message.includes('succes') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isAvailable}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            data-cy="bevestig_verhuur_btn"
          >
            {loading ? 'Bezig...' : isAvailable ? 'Bevestig Verhuur' : 'Niet Beschikbaar'}
          </button>
        </form>
      </div>
    </div>
  );
}
