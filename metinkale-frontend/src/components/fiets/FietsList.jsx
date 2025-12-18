import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as fietsApi from '../../api/fietsen';
import Fiets from './Fiets';

export default function FietsList() {
  const [fietsen, setFietsen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFietsen = async () => {
      try {
        const data = await fietsApi.getAll();
        setFietsen(data);
      } catch (err) {
        setError('Kon fietsen niet laden');
      } finally {
        setLoading(false);
      }
    };
    fetchFietsen();
  }, []);

  if (loading) return <div className="text-center py-12 text-white/60">Laden...</div>;
  if (error) return <div className="text-center py-12 text-red-400">{error}</div>;

  return (
    <div className="py-8" data-cy="fiets_list">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Onze Fietsen</h1>
          <p className="text-white/60 mt-1">Kies jouw perfecte fiets</p>
        </div>
        
        {user?.roles?.includes('admin') && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate('/fietsen/addFiets')} className="btn-primary text-sm" data-cy="add_fiets_btn">
              + Fiets Toevoegen
            </button>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fietsen
          .filter((f) => f.status?.toLowerCase() !== 'inactive')
          .sort((a, b) => a.model.localeCompare(b.model))
          .map((fiets) => (
            <Fiets key={fiets.fietsID} {...fiets} />
          ))}
      </div>

      {fietsen.length === 0 && (
        <div className="text-center py-12 text-white/40">Geen fietsen beschikbaar</div>
      )}
    </div>
  );
}
