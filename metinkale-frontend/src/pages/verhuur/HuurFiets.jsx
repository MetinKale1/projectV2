import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as verhuurApi from '../../api/verhuur';
import './HuurFiets.css';
import { useTheme } from '../../contexts/theme';

export default function HuurFiets() {
  const { theme } = useTheme();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uitleendatum, setUitleendatum] = useState(new Date().toISOString().slice(0, 10));
  const [inleverdatum, setInleverdatum] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.klantID) {
      setMessage('Je moet ingelogd zijn om te huren.');
      return;
    }
    try {
      await verhuurApi.addVerhuur({
        klantID: user.klantID,
        fietsID: parseInt(id, 10),
        uitleendatum,
        inleverdatum,
      });
      setMessage('Verhuur succesvol aangemaakt!');
      setTimeout(() => navigate('/verhuur'), 1500);
    } catch (err) {
      setMessage('Verhuur aanmaken mislukt.');
    }
  };

  return (
    <div className={`huurfiets-container theme-${theme}`}> 
      <h2 className="huurfiets-title">Huur deze fiets</h2>
      <form className="huurfiets-form" onSubmit={handleSubmit}>
        <label>Uitleendatum:</label>
        <input type="date" value={uitleendatum} onChange={(e) => setUitleendatum(e.target.value)} required data-cy="uitleendatum_input" />
        <br />
        <label>Inleverdatum:</label>
        <input type="date" value={inleverdatum} onChange={(e) => setInleverdatum(e.target.value)} data-cy="inleverdatum_input" />
        <br />
        <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }} data-cy="bevestig_verhuur_btn">Bevestig verhuur</button>
      </form>
      {message && <p style={{ color: message.includes('succes') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}
