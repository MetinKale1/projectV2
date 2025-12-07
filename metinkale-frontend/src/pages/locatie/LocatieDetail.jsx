// ...existing code...
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as locatieApi from '../../api/locaties';
import * as fietsApi from '../../api/fietsen';
import Fiets from '../../components/fiets/Fiets';
import './LocatieDetail.css';
import { useTheme } from '../../contexts/theme';

const LocatieDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const idAsNumber = Number(id);
  const [locatie, setLocatie] = useState(null);
  const [fietsen, setFietsen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locatieData = await locatieApi.getById(idAsNumber);
        setLocatie(locatieData);

        const fietsenData = await fietsApi.getAll();
        const fietsenBijLocatie = 
        Array.isArray(fietsenData) ? fietsenData.filter((fiets) => fiets.locatieID === idAsNumber) : [];
        setFietsen(fietsenBijLocatie);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idAsNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!locatie) {
    return (
      <div className={`locatiedetail-container theme-${theme}`}>
        <h1 className={`detail-title theme-${theme}`}>Locatie niet gevonden</h1>
        <p>Er is geen locatie met id {id}.</p>
      </div>
    );
  }

  return (
    <div className={`locatiedetail-container theme-${theme}`} data-cy="locatie-detail"> 
      <h2 className="locatiedetail-title" data-cy="locatie-detail-title">Locatie detail</h2>
      <div className="locatiedetail-info">
        <p data-cy="locatie-detail-straat"><strong>Straat:</strong> {locatie.straat}</p>
        <p data-cy="locatie-detail-nummer"><strong>Nummer:</strong> {locatie.nr}</p>
        <p data-cy="locatie-detail-gemeente"><strong>Gemeente:</strong> {locatie.gemeente}</p>
        <p data-cy="locatie-detail-postcode"><strong>Postcode:</strong> {locatie.postcode}</p>
      </div>

      <h2>Fietsen bij deze locatie:</h2>
      {fietsen.length > 0 ? (
        <div className='grid mt-3'>
          <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3'>
            {fietsen
              .sort((a, b) => a.model.toUpperCase().localeCompare(b.model.toUpperCase()))
              .map((fiets) => (
                <div className='col' key={fiets.fietsID}>
                  <Fiets {...fiets} />
                </div>
              ))}
          </div>
        </div>
      ) : (
        <p>Er zijn geen fietsen gekoppeld aan deze locatie.</p>
      )}
    </div>
  );
};

export default LocatieDetail;