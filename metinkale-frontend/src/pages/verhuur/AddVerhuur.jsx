import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as verhuurApi from '../../api/verhuur';

export default function AddVerhuur() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ klantID: '', fietsID: '', uitleendatum: '', inleverdatum: '' });

  // Wacht tot user data geladen is
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/60">Laden...</div>
      </div>
    );
  }

  // Check admin na laden
  if (!user?.roles?.includes('admin')) {
    return <Navigate to="/forbidden" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await verhuurApi.addVerhuur({
      klantID: Number(form.klantID),
      fietsID: Number(form.fietsID),
      uitleendatum: form.uitleendatum,
      inleverdatum: form.inleverdatum,
    });
    navigate(`/verhuur/${result.verhuurID}`);
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Nieuwe Verhuur</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Klant ID</label>
            <input type="number" value={form.klantID} onChange={(e) => setForm({ ...form, klantID: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Fiets ID</label>
            <input type="number" value={form.fietsID} onChange={(e) => setForm({ ...form, fietsID: e.target.value })} className="input-field" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Uitleendatum</label>
            <input type="date" value={form.uitleendatum} onChange={(e) => setForm({ ...form, uitleendatum: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Inleverdatum</label>
            <input type="date" value={form.inleverdatum} onChange={(e) => setForm({ ...form, inleverdatum: e.target.value })} className="input-field" required />
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn-primary flex-1">Aanmaken</button>
          <button type="button" onClick={() => navigate('/verhuur')} className="btn-secondary flex-1">Annuleren</button>
        </div>
      </form>
    </div>
  );
}
