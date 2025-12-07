// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as locatieApi from '../../api/locaties';

// const AddLocatie = () => {
//   const [straat, setStraat] = useState('');
//   const [huisnummer, setHuisnummer] = useState('');
//   const [postcode, setPostcode] = useState('');
//   const [gemeente, setGemeente] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate inputs
//     if (!straat || !huisnummer || !postcode || !gemeente) {
//       alert('Please fill in all fields.');
//       return;
//     }

//     // Create new locatie
//     const newLocatie = {
//       straat,
//       huisnummer,
//       gemeente,
//       postcode,
      
//     };

//     try {
//       // Add new locatie to the server
//       await locatieApi.addLocatie(newLocatie);
//       console.log('New Locatie Added:', newLocatie);

//       // Navigate back to locatie list
//       navigate('/');
//     } catch (error) {
//       console.error('Error adding locatie:', error);
//       alert('Failed to add locatie. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h1>Add Locatie</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Straat:</label>
//           <input
//             type="text"
//             value={straat}
//             onChange={(e) => setStraat(e.target.value)}
//             placeholder="Enter straat"
//             required
//           />
//         </div>

//         <div>
//           <label>Huisnummer:</label>
//           <input
//             type="text"
//             value={huisnummer}
//             onChange={(e) => setHuisnummer(e.target.value)}
//             placeholder="Enter huisnummer"
//             required
//           />
//         </div>

//         <div>
//           <label>Postcode:</label>
//           <input
//             type="text"
//             value={postcode}
//             onChange={(e) => setPostcode(e.target.value)}
//             placeholder="Enter postcode"
//             required
//           />
//         </div>

//         <div>
//           <label>Gemeente:</label>
//           <input
//             type="text"
//             value={gemeente}
//             onChange={(e) => setGemeente(e.target.value)}
//             placeholder="Enter gemeente"
//             required
//           />
//         </div>

//         <button type="submit">Add Locatie</button>
//       </form>
//     </div>
//   );
// };

// export default AddLocatie;
import { useState } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import * as locatieApi from '../../api/locaties';
import './AddLocatie.css';

const AddLocatie = () => {
  const [straat, setStraat] = useState('');
  const [nr, setNr] = useState(''); // Changed huisnummer to nr
  const [postcode, setPostcode] = useState('');
  const [gemeente, setGemeente] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user || !user.roles || !user.roles.includes('admin')) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!straat || !nr || !postcode || !gemeente) {
      alert('Please fill in all fields.');
      return;
    }

    // Create new locatie
    const newLocatie = {
      straat,
      nr, // Changed huisnummer to nr
      gemeente,
      postcode,
    };
    try {
      await locatieApi.addLocatie(newLocatie);
      console.log('New Locatie Added:', newLocatie);
      navigate('/locaties'); // Navigate to '/locaties' instead of '/'
    } catch (error) {
      console.error('Error adding locatie:', error);
      alert('Failed to add locatie. Please try again.');
    }
  };

  return (
    <div className="addlocatie-container">
      <h2 className="addlocatie-title">Locatie toevoegen</h2>
      <form className="addlocatie-form" onSubmit={handleSubmit}>
        <div>
          <label>Straat:</label>
          <input
            type="text"
            value={straat}
            onChange={(e) => setStraat(e.target.value)}
            placeholder="Enter straat"
            required
          />
        </div>

        <div>
          <label>Huisnummer:</label>
          <input
            type="text"
            value={nr} // Changed huisnummer to nr
            onChange={(e) => setNr(e.target.value)} // Changed huisnummer to nr
            placeholder="Enter huisnummer"
            required
          />
        </div>

        <div>
          <label>Gemeente:</label>
          <input
            type="text"
            value={gemeente}
            onChange={(e) => setGemeente(e.target.value)}
            placeholder="Enter gemeente"
            required
          />
        </div>

        <div>
          <label>Postcode:</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter postcode"
            required
          />
        </div>

        <button type="submit">Add Locatie</button>
      </form>
    </div>
  );
};

export default AddLocatie;