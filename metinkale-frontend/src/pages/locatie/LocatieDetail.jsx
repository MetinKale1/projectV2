import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as locatieApi from '../../api/locaties';
import * as fietsApi from '../../api/fietsen';
import Fiets from '../../components/fiets/Fiets';

export default function LocatieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locatie, setLocatie] = useState(null);
  const [fietsen, setFietsen] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const loc = await locatieApi.getById(Number(id));
      setLocatie(loc);
      const allFietsen = await fietsApi.getAll();
      setFietsen(allFietsen.filter((f) => f.locatieID === Number(id)));
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;
  if (!locatie) return <div className="text-center py-12 text-white/40">Locatie niet gevonden</div>;

  return (
    <div className="py-8" data-cy="locatie-detail">
      <button onClick={() => navigate('/locaties')} className="text-white/60 hover:text-white mb-6 flex items-center gap-2">
        ← Terug naar locaties
      </button>

      <div className="card mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#FF6B35] flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">📍</span>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold gradient-text mb-2" data-cy="locatie-detail-title">
              {locatie.gemeente}
            </h1>
            <p className="text-white/80" data-cy="locatie-detail-straat">{locatie.straat} {locatie.nr}</p>
            <p className="text-white/60" data-cy="locatie-detail-postcode">{locatie.postcode}</p>
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold text-white mb-6">
        Fietsen op deze locatie ({fietsen.length})
      </h2>

      {fietsen.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fietsen.map((fiets) => (
            <Fiets key={fiets.fietsID} {...fiets} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-8 text-white/40">
          Geen fietsen beschikbaar op deze locatie
        </div>
      )}
    </div>
  );
}
