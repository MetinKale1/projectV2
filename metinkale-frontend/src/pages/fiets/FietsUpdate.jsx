import { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { getById, updateFiets } from '../../api/fietsen';
import './FietsUpdate.css';
import { useTheme } from '../../contexts/theme';

const FietsUpdate = () => {
  const { theme } = useTheme();
  const { fietsID } = useParams();
  const [fiets, setFiets] = useState(null);
  const [editModel, setEditModel] = useState('');
  const [editType, setEditType] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editLocatie, setEditLocatie] = useState('');
  const [editFoto, setEditFoto] = useState('');
  const [fotoPreview, setFotoPreview] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFiets = async () => {
      try {
        const data = await getById(fietsID);
        setFiets(data);
        setEditModel(data.model || '');
        setEditType(data.type || '');
        setEditStatus(data.status || '');
        setEditLocatie(data.locatieID || '');
        setEditFoto(data.foto || '');
        setFotoPreview(data.foto || '');
      } catch {
        setMessage('Fiets niet gevonden');
      }
    };
    fetchFiets();
  }, [fietsID]);

  if (!user?.roles?.includes('admin')) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleUpdateFiets = async (e) => {
    e.preventDefault();
    try {
      await updateFiets(fietsID, {
        model: editModel,
        type: editType,
        status: editStatus,
        locatieID: editLocatie,
        foto: editFoto,
      });
      setMessage('Fiets succesvol geüpdatet!');
      setTimeout(() => navigate('/fietsen'), 1500);
    } catch {
      setMessage('Updaten mislukt.');
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFoto(`/images/${file.name}`);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  if (!fiets) return <div>Loading...</div>;

  return (
    <div className={`fietsupdate-container theme-${theme}`}>
      <h1 className={`detail-title theme-${theme}`}>Fiets bijwerken</h1>
      <form className="fietsupdate-form" onSubmit={handleUpdateFiets}>
        <label>Model:
          <input type="text" data-cy="merk_input" value={editModel} onChange={(e) => setEditModel(e.target.value)} required />
        </label>
        <label>Type:
          <input type="text" data-cy="type_input" value={editType} onChange={(e) => setEditType(e.target.value)} required />
        </label>
        <label>Status:
          <select data-cy="status_input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)} required>
            <option value="beschikbaar">beschikbaar</option>
            <option value="verhuurd">verhuurd</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <label>Locatie ID:
          <input type="number" data-cy="locatie_input" value={editLocatie} onChange={(e) => setEditLocatie(e.target.value)} required />
        </label>
        <label>Foto upload:
          <input type="file" data-cy="foto_input" accept="image/*" onChange={handleFotoChange} />
        </label>
        {fotoPreview && (
          <div style={{ margin: '1rem 0' }}>
            <img src={fotoPreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
          </div>
        )}
        <button type="submit" data-cy="submit_btn">Update fiets</button>
      </form>
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
};

export default FietsUpdate;
