import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as fietsApi from '../../api/fietsen';

export default function AddFiets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ model: '', type: '', status: 'Active', locatieID: '', foto: '' });
  const [loading, setLoading] = useState(false);

  if (!user?.roles?.includes('admin')) return <Navigate to="/forbidden" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fietsApi.addFiets({ ...form, locatieID: Number(form.locatieID) });
      navigate('/fietsen');
    } catch {
      alert('Kon fiets niet toevoegen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Fiets Toevoegen</h1>
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Model</label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Kies type</option>
            <option value="City">City</option>
            <option value="Mountain">Mountain</option>
            <option value="E-bike">E-bike</option>
            <option value="Race">Race</option>
          </select>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Locatie ID</label>
          <input
            type="number"
            value={form.locatieID}
            onChange={(e) => setForm({ ...form, locatieID: e.target.value })}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Foto URL</label>
          <input
            type="url"
            value={form.foto}
            onChange={(e) => setForm({ ...form, foto: e.target.value })}
            className="input-field"
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
            {loading ? 'Bezig...' : 'Toevoegen'}
          </button>
          <button type="button" onClick={() => navigate('/fietsen')} className="btn-secondary flex-1">
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
