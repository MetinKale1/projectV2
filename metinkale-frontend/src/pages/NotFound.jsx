// src/pages/NotFound.jsx
import { useLocation, useNavigate } from 'react-router-dom'; // 👈
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate(); // 👈
  const { pathname } = useLocation();

  // 👇
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404 - Pagina niet gevonden</h1>
      <div className="notfound-message">
        Er is geen pagina met als url {pathname}, probeer iets anders.
      </div>
      {/* 👇 */}
      <button className="notfound-link" onClick={handleGoHome}>
        Terug naar home
      </button>
    </div>
  );
};

export default NotFound;
