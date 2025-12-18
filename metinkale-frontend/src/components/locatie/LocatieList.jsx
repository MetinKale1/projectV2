import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as locatieApi from '../../api/locaties';

export default function LocatieList() {
  const [locaties, setLocaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    locatieApi.getAll()
      .then((data) => {
        console.log('Locaties data:', data);
        // Zorg dat data altijd een array is
        const items = Array.isArray(data) ? data : (data?.items || []);
        setLocaties(items);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Kon locaties niet laden');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Onze Locaties</h1>
          <p className="text-white/60 mt-1">Vind een verhuurpunt bij jou in de buurt</p>
        </div>
        {user?.roles?.includes('admin') && (
          <button onClick={() => navigate('/locaties/addLocatie')} className="btn-primary text-sm">
            + Locatie Toevoegen
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locaties.map((loc) => (
          <div
            key={loc.locatieID}
            onClick={() => navigate(`/locaties/${loc.locatieID}`)}
            className="card cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#FF6B35] flex items-center justify-center mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              {loc.gemeente}
            </h3>
            <p className="text-white/60 text-sm mb-1">{loc.straat} {loc.nr}</p>
            <p className="text-white/40 text-sm">{loc.postcode}</p>
            <button className="btn-secondary w-full text-sm mt-4 py-2">
              Bekijk Fietsen
            </button>
          </div>
        ))}
      </div>

      {locaties.length === 0 && (
        <div className="text-center py-12 text-white/40">Geen locaties beschikbaar</div>
      )}
    </div>
  );
}
