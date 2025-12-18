import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as fietsApi from '../../api/fietsen';
import * as verhuurApi from '../../api/verhuur';

export default function FietsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fiets, setFiets] = useState(null);
  const [verhuurInfo, setVerhuurInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fietsApi.getById(Number(id));
        setFiets(data);
        if (data.status === 'verhuurd') {
          const verhuren = await verhuurApi.getAll();
          const actief = verhuren.filter((v) => v.fietsID === Number(id));
          if (actief.length) setVerhuurInfo(actief[actief.length - 1]);
        }
      } catch {
        setError('Kon fiets niet laden');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;
  if (!fiets) return <div className="text-center py-12 text-white/40">Fiets niet gevonden</div>;

  const statusColors = {
    active: 'bg-green-500/20 text-green-400',
    beschikbaar: 'bg-green-500/20 text-green-400',
    verhuurd: 'bg-yellow-500/20 text-yellow-400',
    inactive: 'bg-red-500/20 text-red-400',
  };

  // Check of fiets beschikbaar is om te huren
  const isAvailableToRent = fiets.status?.toLowerCase() === 'beschikbaar' || 
                            fiets.status?.toLowerCase() === 'active';
  const isRented = fiets.status?.toLowerCase() === 'verhuurd';
  const isInactive = fiets.status?.toLowerCase() === 'inactive';

  // Bepaal knop tekst en disabled state
  let buttonText = 'Huur Deze Fiets';
  let buttonDisabled = false;

  if (isInactive) {
    buttonText = 'Niet Beschikbaar (Inactive)';
    buttonDisabled = true;
  } else if (isRented) {
    buttonText = 'Niet Beschikbaar (Verhuurd)';
    buttonDisabled = true;
  }

  return (
    <div className="py-8" data-cy="fiets_detail">
      <button onClick={() => navigate('/fietsen')} className="text-white/60 hover:text-white mb-6 flex items-center gap-2">
        ← Terug naar overzicht
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card p-0 overflow-hidden">
          <img
            src={fiets.foto || '/images/default-bike.jpg'}
            alt={fiets.model}
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Details */}
        <div className="card">
          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="font-display text-3xl font-bold gradient-text" data-cy="fiets_detail_merk">
              {fiets.model}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[fiets.status?.toLowerCase()] || ''}`}>
              {fiets.status}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-white/60">Type</span>
              <span className="text-white font-medium" data-cy="fiets_detail_type">{fiets.type}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-white/60">Locatie ID</span>
              <span className="text-white font-medium">{fiets.locatieID}</span>
            </div>
          </div>

          {/* Waarschuwing voor verhuurd */}
          {isRented && verhuurInfo && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-400">
                Verhuurd tot <strong>{verhuurInfo.inleverdatum}</strong>
              </p>
            </div>
          )}

          {/* Waarschuwing voor inactive */}
          {isInactive && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400">
                Deze fiets is momenteel niet beschikbaar voor verhuur.
              </p>
            </div>
          )}

          {/* Huur knop */}
          <button
            onClick={() => !buttonDisabled && navigate(`/verhuur/huur/${id}`)}
            disabled={buttonDisabled}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            data-cy="edit_fiets_btn"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
