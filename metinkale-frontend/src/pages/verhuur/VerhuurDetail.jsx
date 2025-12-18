import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as verhuurApi from '../../api/verhuur';

export default function VerhuurDetail() {
  const { verhuurID } = useParams();
  const navigate = useNavigate();
  const [verhuur, setVerhuur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!verhuurID) return;
    
    const numId = Number(verhuurID);
    
    if (isNaN(numId)) {
      setError('Ongeldige verhuur ID');
      setLoading(false);
      return;
    }

    verhuurApi.getById(numId)
      .then((data) => {
        console.log('Verhuur data ontvangen:', data);
        setVerhuur(data);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Kon verhuur niet laden');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [verhuurID]);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;
  if (!verhuur) return <div className="text-center py-12 text-white/40">Verhuur niet gevonden</div>;

  // Ondersteun beide formaten (direct of genest)
  const fietsId = verhuur.fietsID || verhuur.fiets?.fietsID;
  const klantId = verhuur.klantID || verhuur.klant?.klantID;
  const isActive = new Date(verhuur.inleverdatum) >= new Date();

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate('/verhuur')} className="text-white/60 hover:text-white mb-6">
        ← Terug naar overzicht
      </button>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold gradient-text">Verhuur #{verhuur.verhuurID}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
            {isActive ? 'Actief' : 'Afgelopen'}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-white/10">
            <span className="text-white/60">Fiets ID</span>
            <span className="text-white font-medium">{fietsId || 'Onbekend'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/10">
            <span className="text-white/60">Klant ID</span>
            <span className="text-white font-medium">{klantId || 'Onbekend'}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-white/10">
            <span className="text-white/60">Uitleendatum</span>
            <span className="text-white font-medium">{verhuur.uitleendatum}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-white/60">Inleverdatum</span>
            <span className="text-white font-medium">{verhuur.inleverdatum}</span>
          </div>
        </div>

        {fietsId && (
          <button onClick={() => navigate(`/fietsen/${fietsId}`)} className="btn-secondary w-full mt-6">
            Bekijk Fiets
          </button>
        )}
      </div>
    </div>
  );
}
