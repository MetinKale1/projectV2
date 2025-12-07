import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import Verhuur from './Verhuur';
import { useTheme } from '../../contexts/theme';
import './VerhuurList.css';
import * as verhuurApi from '../../api/verhuur';

const VerhuurList = () => {
  const { theme } = useTheme();
  const [verhuur, setVerhuur] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchVerhuur = async () => {
      try {
        let data;
        if (user?.roles?.includes('admin')) {
          data = await verhuurApi.getAll();
        } else if (user?.klantID) {
          data = await verhuurApi.getByKlantId(user.klantID);
        } else {
          data = [];
        }
        if (Array.isArray(data)) {
          setVerhuur(data);
        } else if (data && data.items) {
          setVerhuur(data.items);
        } else {
          setVerhuur([]);
        }
      } catch (err) {
        setError('Failed to load verhuur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerhuur();
  }, [user]);

  const navigateToAddVerhuur = () => {
    navigate('/verhuur/addVerhuur');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`verhuur-list-container mt-3 theme-${theme}`} data-cy="verhuur-list">
      <h2 className="mb-4 text-center">Verhuur</h2>
      {user?.roles?.includes('admin') && (
        <button className="btn btn-primary mb-4" onClick={navigateToAddVerhuur} data-cy="add-verhuur-button">
          Add Verhuur
        </button>
      )}
      <div className={`verhuur-list-grid theme-${theme}`}> 
        {verhuur
          .sort((a, b) => a.verhuurID - b.verhuurID)
          .map((item) => (
            <div className={`verhuur-item theme-${theme}`} key={item.verhuurID} data-cy="verhuur" style={{ cursor: 'pointer' }} 
              onClick={() => navigate(`/verhuur/${item.verhuurID}`)}>
              <Verhuur {...item} theme={theme} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default VerhuurList;