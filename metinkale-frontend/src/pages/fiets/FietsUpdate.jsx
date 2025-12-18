import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as fietsApi from '../../api/fietsen';

export default function FietsUpdate() {
  const { id } = useParams();
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ model: '', type: '', status: '', locatieID: '', foto: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fietsApi.getById(Number(id)).then((data) => {
      setForm(data);
      setLoading(false);
    });
  }, [id]);

  // Wacht tot user data geladen is
  if (!ready || loading) {
    return <div className="text-center py-12 text-white/60">Laden...</div>;
  }

  // Check admin na laden
  if (!user?.roles?.includes('admin')) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fietsApi.updateFiets(Number(id), { ...form, locatieID: Number(form.locatieID) });
      navigate('/fietsen');
    } catch {
      alert('Kon fiets niet bijwerken');
    }
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Fiets Bewerken</h1>
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Model</label>
          <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="input-field" required />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field" required>
            <option value="City">City</option>
            <option value="Mountain">Mountain</option>
            <option value="E-bike">E-bike</option>
            <option value="Race">Race</option>
          </select>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field" required>
            <option value="beschikbaar">Beschikbaar</option>
            <option value="verhuurd">Verhuurd</option>
            <option value="onderhoud">Onderhoud</option>
          </select>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Locatie ID</label>
          <input type="number" value={form.locatieID} onChange={(e) => setForm({ ...form, locatieID: e.target.value })} className="input-field" required />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Foto URL</label>
          <input type="url" value={form.foto} onChange={(e) => setForm({ ...form, foto: e.target.value })} className="input-field" />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn-primary flex-1">Opslaan</button>
          <button type="button" onClick={() => navigate('/fietsen')} className="btn-secondary flex-1">Annuleren</button>
        </div>
      </form>
    </div>
  );
}
