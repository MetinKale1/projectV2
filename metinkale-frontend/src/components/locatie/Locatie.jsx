import { useNavigate } from 'react-router-dom';

const Locatie = ({locatieID, straat, nr, gemeente, postcode, theme }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/locaties/${locatieID}`); // Navigate back to the list of locations
  };

  return (
    <div className={`card locatie-card mb-4 theme-${typeof theme !== 'undefined' ? theme : 'light'}`}> 
      <div className="card-body">
        <h5 className="card-title">Locatie Details</h5>
        <p className="card-text">
          <strong>Straat:</strong> {straat}
        </p>
        <p className="card-text">
          <strong>Nummer:</strong> {nr}
        </p>
        <p className="card-text">
          <strong>Gemeente:</strong> {gemeente}
        </p>
        <p className="card-text">
          <strong>Postcode:</strong> {postcode}
        </p>
        <button className="btn btn-primary" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default Locatie;
