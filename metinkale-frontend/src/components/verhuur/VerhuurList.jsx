import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as verhuurApi from '../../api/verhuur';

export default function VerhuurList() {
  const [verhuren, setVerhuren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    verhuurApi.getAll().then((data) => {
      setVerhuren(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;

  const isActive = (v) => new Date(v.inleverdatum) >= new Date();

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Verhuringen</h1>
          <p className="text-white/60 mt-1">Overzicht van alle verhuringen</p>
        </div>
        {user?.roles?.includes('admin') && (
          <button onClick={() => navigate('/verhuur/add')} className="btn-primary text-sm">
            + Nieuwe Verhuur
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {verhuren.map((v) => (
          <div
            key={v.verhuurID}
            onClick={() => navigate(`/verhuur/${v.verhuurID}`)}
            className="card cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isActive(v) ? 'bg-green-400' : 'bg-white/20'}`} />
              <div>
                <p className="font-medium text-white">Verhuur #{v.verhuurID}</p>
                <p className="text-white/60 text-sm">Fiets #{v.fietsID} • Klant #{v.klantID}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">{v.uitleendatum} → {v.inleverdatum}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${isActive(v) ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                {isActive(v) ? 'Actief' : 'Afgelopen'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {verhuren.length === 0 && (
        <div className="card text-center py-12 text-white/40">Geen verhuringen gevonden</div>
      )}
    </div>
  );
}
