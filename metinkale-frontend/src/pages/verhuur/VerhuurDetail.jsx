import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as verhuurApi from '../../api/verhuur';
import { useNavigate } from 'react-router-dom';
import './VerhuurDetail.css';
import { useTheme } from '../../contexts/theme';

const VerhuurDetail = () => {
  const { theme } = useTheme();
  const { verhuurID } = useParams();
  const idAsNumber = parseInt(verhuurID, 10);
  const [verhuur, setVerhuur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleAnnuleer = async () => {
    try {
      const vandaag = new Date().toISOString().slice(0, 10);
      await verhuurApi.updateVerhuur(verhuur.verhuurID, {
        klantID: verhuur.klant?.klantID,
        fietsID: verhuur.fiets?.fietsID,
        uitleendatum: verhuur.uitleendatum,
        inleverdatum: vandaag,
      });
      setMessage('Verhuur geannuleerd/vervroegd beëindigd.');
      setTimeout(() => navigate('/verhuur'), 1500);
    } catch {
      setMessage('Annuleren mislukt.');
    }
  };

  useEffect(() => {
    const fetchVerhuur = async () => {
      try {
        const verhuurData = await verhuurApi.getById(idAsNumber);
        setVerhuur(verhuurData);
      } catch (err) {
        setError('Failed to load verhuur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerhuur();
  }, [idAsNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!verhuur) {
    return (
      <div className="verhuurdetail-container">
        <h1>Verhuur niet gevonden</h1>
        <p>Er is geen verhuur met id {verhuurID}.</p>
      </div>
    );
  }

  return (
    <div className={`verhuurdetail-container theme-${theme}`}> 
      <h1 className={`detail-title theme-${theme}`}>Verhuur detail</h1>
      <div className="verhuurdetail-info">
        <p><strong>Verhuur ID:</strong> {verhuur.verhuurID}</p>
        <p><strong>Klant ID:</strong> {verhuur.klant?.klantID}</p>
        <p><strong>Fiets ID:</strong> {verhuur.fiets?.fietsID}</p>
        <p><strong>Uitleendatum:</strong> {verhuur.uitleendatum}</p>
        <p><strong>Inleverdatum:</strong> {verhuur.inleverdatum}</p>
        {/* Voeg hier meer details toe indien gewenst */}
      </div>
      {(!verhuur.inleverdatum || new Date(verhuur.inleverdatum) > new Date()) && (
        <button className="btn btn-danger" style={{marginTop:10}} onClick={handleAnnuleer}>
          Annuleer/vervroegd beëindigen
        </button>
      )}
      {message && <p style={{ color: message.includes('geannuleerd') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default VerhuurDetail;
