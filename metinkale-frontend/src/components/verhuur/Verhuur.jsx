import { useNavigate } from 'react-router-dom';

const Verhuur = ({ verhuurID, uitleendatum, inleverdatum, klant, fiets, theme }) => {
  const navigate = useNavigate();
  const klantID = klant?.klantID;
  const fietsID = fiets?.fietsID;

  const handleViewDetails = () => {
    navigate(`/verhuur/${verhuurID}`);
  };

  return (
    <div className={`card verhuur-card mb-4 theme-${typeof theme !== 'undefined' ? theme : 'light'}`} data-cy="verhuur">
      <div className="card-body">
        <h5 className="card-title">Verhuur ID: {verhuurID}</h5>
        <p className="card-text">
          Klant ID: {klantID} <br />
          Fiets ID: {fietsID} <br />
          Uitleendatum: {uitleendatum} <br />
          Inleverdatum: {inleverdatum}
        </p>
        <button className="btn btn-primary" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default Verhuur;