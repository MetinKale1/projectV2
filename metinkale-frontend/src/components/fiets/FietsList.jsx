// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as fietsApi from '../../api/fietsen';
// import Fiets from './Fiets';

// const FietsList = () => {
//   const [fietsen, setFietsen] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFietsen = async () => {
//       try {
//         const fietsenData = await fietsApi.getAll();
//         setFietsen(fietsenData);
//       } catch (err) {
//         setError('Failed to load fietsen');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFietsen();
//   }, []);

//   const navigateToAddFiets = () => {
//     navigate('/addFiets');
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className='grid mt-3'>
//       <h2 className="mb-4">Fietsen</h2>
//       <button className="btn btn-primary mb-4" onClick={navigateToAddFiets}>
//         Add Fiets
//       </button>
//       <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3'>
//         {fietsen
//           .sort((a, b) => a.model.toUpperCase().localeCompare(b.model.toUpperCase()))
//           .map((fiets) => (
//             <div className='col' key={fiets.fietsID}>
//               <Fiets {...fiets} />
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default FietsList;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as fietsApi from '../../api/fietsen';
import Fiets from './Fiets';
import { useTheme } from '../../contexts/theme';
import './FietsList.css';

const FietsList = () => {
  const { theme } = useTheme();
  const [fietsen, setFietsen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    const fetchFietsen = async () => {
      try {
        const fietsenData = await fietsApi.getAll();
        setFietsen(fietsenData);
      } catch (err) {
        setError('Failed to load fietsen');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFietsen();
  }, []);

  const navigateToAddFiets = () => {
    navigate('/fietsen/addFiets');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`fiets-list-container mt-3 theme-${theme}`} data-cy="fiets_list">
      <h2 className="mb-4 text-center">Fietsen</h2>
      {user?.roles?.includes('admin') && (
        <div className="mb-4 d-flex align-items-center gap-2">
          <button className="btn btn-primary" onClick={navigateToAddFiets} data-cy="add_fiets_btn">
            Add Fiets
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (e.target.fietsID.value) {
                navigate(`/fietsen/update/${e.target.fietsID.value}`);
              }
            }}
            className="d-flex align-items-center gap-2"
            style={{marginLeft: '10px'}}
          >
            <input
              type="number"
              name="fietsID"
              placeholder="Fiets ID"
              min="1"
              className="form-control"
              style={{width: '120px'}}
              required
            />
            <button type="submit" className="btn btn-warning" data-cy="update-fiets-direct">
              Fiets aanpassen
            </button>
          </form>
        </div>
      )}
      <div className={`fiets-list-grid theme-${theme}`}> 
        {fietsen
          .filter((fiets) => fiets.status?.toLowerCase() !== 'inactive')
          .sort((a, b) => a.model.toUpperCase().localeCompare(b.model.toUpperCase()))
          .map((fiets) => (
            <div className={`fiets-item theme-${theme}`} key={fiets.fietsID} data-cy="fiets_card">
              <Fiets {...fiets} theme={theme} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default FietsList;