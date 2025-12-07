import { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import * as verhuurApi from '../../api/verhuur';
import './AddVerhuur.css';

const AddVerhuur = () => {
  const [klantID, setKlantID] = useState('');
  const [fietsID, setFietsID] = useState('');
  const [uitleendatum, setUitleendatum] = useState('');
  const [inleverdatum, setInleverdatum] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user || !user.roles || !user.roles.includes('admin')) {
    return <Navigate to="/forbidden" replace />;
  }
  // Toon popup bij laden van de pagina
  // Popup verdwijnt na klikken op OK

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!klantID || !fietsID || !uitleendatum || !inleverdatum) {
      alert('Please fill in all fields.');
      return;
    }

    const newVerhuur = {
      klantID: Number(klantID),
      fietsID: Number(fietsID),
      uitleendatum,
      inleverdatum,
    };

    try {
      const createdVerhuur = await verhuurApi.addVerhuur(newVerhuur);
      console.log('Backend response:', createdVerhuur);
      if (createdVerhuur && createdVerhuur.verhuurID) {
        alert(`Verhuur succesvol aangemaakt! ID: ${createdVerhuur.verhuurID}`);
        navigate(`/verhuur/${createdVerhuur.verhuurID}`);
      } else {
        alert('Verhuur aangemaakt, maar geen verhuurID ontvangen van backend. Response: ' 
          + JSON.stringify(createdVerhuur));
        navigate('/verhuur');
      }
    } catch (error) {
      console.error('Error adding verhuur:', error);
      alert('Failed to add verhuur. Please try again.');
    }
  };

  return (
    <div className="addverhuur-container">
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--background, #fff)',
            color: 'var(--text, #222)',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
            maxWidth: '400px',
            textAlign: 'center',
          }}>
            <h3 style={{marginBottom: '16px'}}>Let op!</h3>
            <p style={{marginBottom: '24px'}}>Dit scherm is alleen bedoeld om manueel een verhuur aan te maken als de klant problemen heeft met het systeem.<br/>Gebruik dit alleen in uitzonderlijke gevallen.</p>
            <button style={{padding: '10px 24px', borderRadius: '8px', background: 'linear-gradient(90deg, #1a4d8f 0%, #3b82f6 100%)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}} onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
      <h2 className="addverhuur-title">Verhuur toevoegen</h2>
      <form className="addverhuur-form" onSubmit={handleSubmit}>
        <div>
          <label>Klant ID:</label>
          <input
            type="number"
            value={klantID}
            onChange={(e) => setKlantID(e.target.value)}
            placeholder="Enter klant ID"
            required
          />
        </div>
        <div>
          <label>Fiets ID:</label>
          <input
            type="number"
            value={fietsID}
            onChange={(e) => setFietsID(e.target.value)}
            placeholder="Enter fiets ID"
            required
          />
        </div>
        <div>
          <label>Uitleendatum:</label>
          <input
            type="date"
            value={uitleendatum}
            onChange={(e) => setUitleendatum(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Inleverdatum:</label>
          <input
            type="date"
            value={inleverdatum}
            onChange={(e) => setInleverdatum(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Verhuur</button>
      </form>
    </div>
  );
};

export default AddVerhuur;
