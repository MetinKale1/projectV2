import React, { useEffect, useState } from 'react';
import { getAll, getByKlantId, updateVerhuur } from '../../api/verhuur';

// Simpel voorbeeld: haal klant info uit localStorage
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const VerhuurList = () => {
  const [verhuren, setVerhuren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();
      let data;
      if (user && user.role === 'admin') {
        data = await getAll();
      } else if (user && user.klantID) {
        data = await getByKlantId(user.klantID);
      } else {
        data = [];
      }
      setVerhuren(data);
    } catch (err) {
      setError('Kon verhuur niet ophalen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnnuleer = async (v) => {
    try {
      // Zet de inleverdatum op vandaag
      const vandaag = new Date().toISOString().slice(0, 10);
      await updateVerhuur(v.verhuurID, {
        klantID: v.klant?.klantID,
        fietsID: v.fiets?.fietsID,
        uitleendatum: v.uitleendatum,
        inleverdatum: vandaag,
      });
      await fetchData();
    } catch (err) {
      setError('Annuleren mislukt');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Verhuur overzicht</h2>
      {verhuren.length === 0 ? (
        <div>Geen verhuur gevonden.</div>
      ) : (
        <ul>
          {verhuren.map((v) => (
            <li key={v.verhuurID}>
              Fiets: {v.fiets?.model} | Klant: {v.klant?.voornaam} {v.klant?.achternaam} | Uitleen: {v.uitleendatum} | Inlever: {v.inleverdatum}
              {(!v.inleverdatum || new Date(v.inleverdatum) > new Date()) && (
                <button style={{marginLeft:10}} onClick={() => handleAnnuleer(v)}>
                  Annuleer/vervroegd beëindigen
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VerhuurList;
