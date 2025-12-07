import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import * as klantApi from '../api/klant';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [klant, setKlant] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [emailadres, setEmailadres] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [foto, setFoto] = useState('/images/default.jpg');
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchKlant() {
      if (user?.klantID) {
        const data = await klantApi.getKlantById(user.klantID);
        setKlant(data);
        setVoornaam(data.voornaam || '');
        setAchternaam(data.achternaam || '');
        setEmailadres(data.emailadres || '');
        setFoto(data.profielfoto ? data.profielfoto : '/images/default.jpg');
      }
    }
    fetchKlant();
  }, [user]);

  const handleFotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(`/images/${e.target.files[0].name}`);
      setFotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
    setError('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setMessage('');
    setError('');
    // Reset fields to klant data
    if (klant) {
      setVoornaam(klant.voornaam || '');
      setAchternaam(klant.achternaam || '');
      setEmailadres(klant.emailadres || '');
      setFoto(klant.profielfoto ? klant.profielfoto : '/images/default.jpg');
      setFotoPreview(null);
      setWachtwoord('');
    }
  };

  const handleSave = async () => {
    if (user?.klantID) {
      try {
        const updatedKlant = {
          voornaam,
          achternaam,
          emailadres,
          profielfoto: foto,
        };
        if (wachtwoord) updatedKlant.wachtwoord = wachtwoord;
        await klantApi.updateKlantFoto(user.klantID, updatedKlant);
        setMessage('Gegevens opgeslagen!');
        setError('');
        setEditMode(false);
        setFotoPreview(null);
        const data = await klantApi.getKlantById(user.klantID);
        setKlant(data);
        setVoornaam(data.voornaam || '');
        setAchternaam(data.achternaam || '');
        setEmailadres(data.emailadres || '');
        setFoto(data.profielfoto ? data.profielfoto : '/images/default.jpg');
        setWachtwoord('');
      } catch (err) {
        setError('Opslaan mislukt. Probeer opnieuw.');
      }
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profiel</h2>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <img
          src={fotoPreview || foto}
          alt="Profielfoto"
          style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
      {editMode ? (
  <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <label>Profielfoto wijzigen:</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFotoChange}
            className="profile-input"
          />
          <label>Voornaam:</label>
          <input
            type="text"
            value={voornaam}
            onChange={(e) => setVoornaam(e.target.value)}
            placeholder="Voornaam"
            className="profile-input"
          />
          <label>Achternaam:</label>
          <input
            type="text"
            value={achternaam}
            onChange={(e) => setAchternaam(e.target.value)}
            placeholder="Achternaam"
            className="profile-input"
          />
          <label>Emailadres:</label>
          <input
            type="email"
            value={emailadres}
            onChange={(e) => setEmailadres(e.target.value)}
            placeholder="Emailadres"
            className="profile-input"
          />
          <label>Nieuw wachtwoord (optioneel):</label>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="Nieuw wachtwoord (optioneel)"
            className="profile-input"
          />
          <button className="profile-form-button" type="submit">Opslaan</button>
          <button className="profile-form-button" onClick={handleCancel} type="button">Annuleren</button>
        </form>
      ) : (
        <>
          <p><b>Naam:</b> {voornaam} {achternaam}</p>
          <p><b>Email:</b> {emailadres}</p>
          <button className="profile-form-button" onClick={handleEdit}>Bewerk profiel</button>
        </>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
