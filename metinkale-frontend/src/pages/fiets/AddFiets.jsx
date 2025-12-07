import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import * as fietsApi from '../../api/fietsen';
import './AddFiets.css';

const AddFiets = () => {
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('Active'); // Default to 'Active'
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef();
  const [locatieID, setLocatieID] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user || !user.roles || !user.roles.includes('admin')) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!model || !type || !status || !foto || !locatieID) {
      alert('Please fill in all fields.');
      return;
    }

    // Alleen bestandsnaam meesturen
    let fotoData = foto;
    if (foto instanceof File) {
      fotoData = `/images/${foto.name}`;
    }
    const newFiets = {
      locatieID: Number(locatieID),
      model,
      type,
      status,
      foto: fotoData,
    };

    try {
      // Add new fiets to the server
      await fietsApi.addFiets(newFiets);
      console.log('New Fiets Added:', newFiets);

      // Navigate back to fiets list
      navigate('/');
    } catch (error) {
      console.error('Error adding fiets:', error);
      alert('Failed to add fiets. Please try again.');
    }
  };

  return (
    <div className="add-fiets-container">
      <h2 className="addfiets-title">Fiets toevoegen</h2>
      <form className="addfiets-form" onSubmit={handleSubmit}>
        <div>
          <label>Locatie ID:</label>
          <input
            type="number"
            value={locatieID}
            onChange={(e) => setLocatieID(e.target.value)}
            placeholder="Enter locatie ID"
            required
            data-cy="locatie_id_input"
          />
        </div>

        <div>
          <label>Model:</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter model"
            required
            data-cy="merk_input"
          />
        </div>

        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter type"
            required
            data-cy="type_input"
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            data-cy="status_input"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label>Foto:</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFoto(e.target.files[0]);
                setFotoPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            required
            data-cy="foto_input"
          />
          {fotoPreview && (
            <div>
              <img src={fotoPreview} alt="Preview" />
              <p>Wordt opgeslagen als: /images/{foto instanceof File ? foto.name : foto}</p>
            </div>
          )}
        </div>

        <button type="submit" data-cy="submit_btn">Add Fiets</button>
      </form>
    </div>
  );
};

export default AddFiets;