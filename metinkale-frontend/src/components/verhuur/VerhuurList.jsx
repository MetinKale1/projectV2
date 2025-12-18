import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as verhuurApi from '../../api/verhuur';

export default function VerhuurList() {
  const [verhuren, setVerhuren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  useEffect(() => {
    const fetchVerhuren = async () => {
      // Wacht tot user data geladen is
      if (!ready) {
        return;
      }

      try {
        let data;
        
        // Als de gebruiker admin is, haal alle verhuren op
        if (user?.roles?.includes('admin')) {
          data = await verhuurApi.getAll();
        } 
        // Anders, haal alleen de verhuren van deze klant op
        else if (user?.klantID) {
          data = await verhuurApi.getByKlantId(user.klantID);
        } 
        // Als er geen user of klantID is, lege array
        else {
          data = [];
        }
        
        setVerhuren(data);
      } catch (error) {
        console.error('Error fetching verhuren:', error);
        setVerhuren([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerhuren();
  }, [user, ready]);

  // Toon loading terwijl user of verhuren laden
  if (!ready || loading) {
    return <div className="text-center py-12 text-white/60">Laden...</div>;
  }

  const isActive = (v) => new Date(v.inleverdatum) >= new Date();

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">
            {user?.roles?.includes('admin') ? 'Alle Verhuringen' : 'Mijn Verhuringen'}
          </h1>
          <p className="text-white/60 mt-1">
            {user?.roles?.includes('admin') 
              ? 'Overzicht van alle verhuringen' 
              : 'Overzicht van jouw verhuurde fietsen'}
          </p>
        </div>
        {user?.roles?.includes('admin') && (
          <button onClick={() => navigate('/verhuur/addVerhuur')} className="btn-primary text-sm">
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
                <p className="text-white/60 text-sm">
                  Fiets: {v.fiets?.model || `#${v.fietsID}`}
                  {user?.roles?.includes('admin') && (
                    <> • Klant: {v.klant?.voornaam || `#${v.klantID}`}</>
                  )}
                </p>
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
        <div className="card text-center py-12 text-white/40">
          {user?.roles?.includes('admin') 
            ? 'Geen verhuringen gevonden' 
            : 'Je hebt nog geen fietsen verhuurd'}
        </div>
      )}
    </div>
  );
}
