import { useNavigate } from 'react-router-dom';

const Fiets = ({ fietsID, model, type, status, foto, theme }) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/fietsen/${fietsID}`);
  };
  // theme prop for dark/light mode
  return (
    <div className={`card fiets-card mb-4 theme-${typeof theme !== 'undefined' ? theme : 'light'}`} data-cy="fiets_card">
      <img src={foto} alt={`${model} - ${type}`} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title" data-cy="fiets_card_merk">{model}</h5>
        <p className="card-text" data-cy="fiets_card_type">
          Type: {type} <br />
          Status: {status}
        </p>
        <button className="btn btn-primary" onClick={handleViewDetails} data-cy="view_details_btn">
          View Details
        </button>
      </div>
    </div>
  );
};

export default Fiets;