import { useTheme } from '../../contexts/theme';
import './LocatieList.css';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as locatieApi from '../../api/locaties';
// import Locatie from './Locatie'; // Assuming Locatie component exists for rendering individual locatie details.

// export default function LocatieList() {
//   const [locaties, setLocaties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLocaties = async () => {
//       try {
//         const response = await locatieApi.getAll();
//         console.log('API Response:', response); // Log the response to inspect the structure
        
//         // Make sure the response data is an array
//         if (Array.isArray(response.data)) {
//           setLocaties(response.data); // Assuming response.data is the array of locations
//         } else if (response.data && response.data.items) {
//           setLocaties(response.data.items); // In case the data is nested inside 'items'
//         } else {
//           throw new Error('Invalid response structure');
//         }
//       } catch (err) {
//         setError('Failed to load locaties');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocaties();
//   }, []);

//   const navigateToAddLocatie = () => {
//     navigate('/addLocatie');
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="grid mt-3">
//       <h2 className="mb-4">Locaties</h2>
//       <button className="btn btn-primary mb-4" onClick={navigateToAddLocatie}>
//         Add Locatie
//       </button>
//       <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-3">
//         {locaties
//           .sort((a, b) => a.straat.toUpperCase().localeCompare(b.straat.toUpperCase()))
//           .map((locatie) => (
//             <div className="col" key={locatie.locatieID}>
//               <Locatie {...locatie} />
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as locatieApi from '../../api/locaties';
import Locatie from './Locatie'; // Assuming Locatie component exists for rendering individual locatie details.

export default function LocatieList() {
  const { theme } = useTheme();
  const [locaties, setLocaties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLocaties = async () => {
      try {
        const response = await locatieApi.getAll();
        console.log('API Response:', response); // Log the response to inspect the structure
        
        // Make sure the response data is an array
        if (Array.isArray(response.data)) {
          setLocaties(response.data); // Assuming response.data is the array of locations
        } else if (response.data && response.data.items) {
          setLocaties(response.data.items); // In case the data is nested inside 'items'
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        setError('Failed to load locaties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocaties();
  }, []);

  const navigateToAddLocatie = () => {
    navigate('/locaties/addLocatie');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`locatie-list-container mt-3 theme-${theme}`} data-cy="locatie-list">
      <h2 className="mb-4 text-center">Locaties</h2>
      {user?.roles?.includes('admin') && (
        <button className="btn btn-primary mb-4" onClick={navigateToAddLocatie} data-cy="add-locatie-button">
          Add Locatie
        </button>
      )}
      <div className={`locatie-list-grid theme-${theme}`}> 
        {locaties
          .sort((a, b) => a.straat.toUpperCase().localeCompare(b.straat.toUpperCase()))
          .map((locatie) => (
            <div className={`locatie-item theme-${theme}`} key={locatie.locatieID} data-cy="locatie" onClick={() => navigate(`/locaties/${locatie.locatieID}`)} style={{cursor: 'pointer'}}>
              <Locatie {...locatie} theme={theme} />
            </div>
          ))}
      </div>
    </div>
  );
}