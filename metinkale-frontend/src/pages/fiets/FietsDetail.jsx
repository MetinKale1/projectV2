// import { useParams } from 'react-router-dom';
// import { FIETS_DATA } from '../../api/mock_data'; // Assuming this is where the data is imported from
// import './FietsDetail.css';

// const FietsDetail = () => {
//   const { id } = useParams();
//   const idAsNumber = parseInt(id, 10);
//   const fiets = FIETS_DATA.find((b) => b.fietsID === idAsNumber);

//   if (!fiets) {
//     return (
//       <div className="fiets-detail-container">
//         <h1>Fiets niet gevonden</h1>
//         <p>Er is geen fiets met id {id}.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="fiets-detail-container">
//       <div className="fiets-detail-image">
//         <img src={fiets.foto} alt={`${fiets.model} image`} />
//       </div>
//       <div className="fiets-detail-info">
//         <h1>{fiets.model}</h1>
//         <p><strong>Type:</strong> {fiets.type}</p>
//         <p><strong>Status:</strong> {fiets.status}</p>
//         <p>Hier komen de details van {fiets.model}.</p>
//         <button className="btn btn-primary">Huur deze fiets</button>
//       </div>
//     </div>
//   );
// };

// export default FietsDetail;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as fietsApi from '../../api/fietsen';
import * as verhuurApi from '../../api/verhuur';
import { useAuth } from '../../contexts/auth';
import './FietsDetail.css';
import { useTheme } from '../../contexts/theme';

const FietsDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const idAsNumber = parseInt(id, 10);
  const [fiets, setFiets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const handleAnnuleer = async () => {
    if (!verhuurInfo) return;
    try {
      const vandaag = new Date().toISOString().slice(0, 10);
      await verhuurApi.updateVerhuur(verhuurInfo.verhuurID, {
        klantID: verhuurInfo.klant?.klantID,
        fietsID: verhuurInfo.fiets?.fietsID,
        uitleendatum: verhuurInfo.uitleendatum,
        inleverdatum: vandaag,
      });
      setMessage('Verhuur geannuleerd/vervroegd beëindigd.');
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setMessage('Annuleren mislukt.');
    }
  };
  const [verhuurInfo, setVerhuurInfo] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiets = async () => {
      try {
        const fietsData = await fietsApi.getById(idAsNumber);
        setFiets(fietsData);
        // Als fiets verhuurd is, haal verhuur info op
        if (fietsData.status === 'verhuurd') {
          // Zoek de laatste verhuur van deze fiets
          const alleVerhuur = await verhuurApi.getAll();
          const verhuurFiets = alleVerhuur.filter((v) => v.fiets?.fietsID === idAsNumber && v.fiets?.status === 'verhuurd');
          // Neem de verhuur met de laatste inleverdatum
          if (verhuurFiets.length > 0) {
            const laatste = verhuurFiets.reduce((a, b) => new Date(a.inleverdatum) > new Date(b.inleverdatum) ? a : b);
            setVerhuurInfo(laatste);
          }
        }
      } catch (err) {
        setError('Failed to load fiets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiets();
  }, [idAsNumber]);

  const handleHuurFiets = () => {
    navigate(`/verhuur/huur/${idAsNumber}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!fiets) {
    return (
      <div className="fietsdetail-container">
        <h1>Fiets niet gevonden</h1>
        <p>Er is geen fiets met id {id}.</p>
      </div>
    );
  }

  return (
    <div className={'main-container'}>
      <div className={`fietsdetail-container theme-${theme}`} data-cy="fiets_detail"> 
        <h2 className="fietsdetail-title">Fiets detail</h2>
        <div className="fiets-detail-image fietsdetail-img">
          <img src={fiets.foto} alt={`${fiets.model} image`} />
        </div>
        <div className="fiets-detail-info fietsdetail-info">
          <h1 data-cy="fiets_detail_merk">{fiets.model}</h1>
          <p data-cy="fiets_detail_type"><strong>Type:</strong> {fiets.type}</p>
          <p><strong>Status:</strong> {fiets.status}</p>
          {fiets.status === 'verhuurd' && verhuurInfo && (
            <p style={{ color: 'red' }}>
              Deze fiets is verhuurd tot <strong>{verhuurInfo.inleverdatum}</strong> door {verhuurInfo.klant?.voornaam} {verhuurInfo.klant?.achternaam}
            </p>
          )}
          <p>Hier komen de details van {fiets.model}.</p>
          <button className="btn btn-primary fietsdetail-btn" onClick={handleHuurFiets} disabled={fiets.status === 'verhuurd'} data-cy="edit_fiets_btn">
            Huur deze fiets
          </button>
          {fiets.status === 'verhuurd' && verhuurInfo && (
            <button className="btn btn-danger" style={{marginLeft:10, marginTop:10}} onClick={handleAnnuleer} data-cy="delete_fiets_btn">
              Annuleer/vervroegd beëindigen
            </button>
          )}
          {message && <p style={{ color: message.includes('geannuleerd') ? 'green' : 'red' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default FietsDetail;