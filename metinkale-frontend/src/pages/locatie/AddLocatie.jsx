import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import * as locatieApi from '../../api/locaties';

export default function AddLocatie() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ straat: '', nr: '', gemeente: '', postcode: '' });

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
    await locatieApi.addLocatie({ ...form, nr: Number(form.nr), postcode: Number(form.postcode) });
    navigate('/locaties');
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Locatie Toevoegen</h1>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-white/80 text-sm font-medium mb-2">Straat</label>
            <input type="text" value={form.straat} onChange={(e) => setForm({ ...form, straat: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Nr</label>
            <input type="number" value={form.nr} onChange={(e) => setForm({ ...form, nr: e.target.value })} className="input-field" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Gemeente</label>
            <input type="text" value={form.gemeente} onChange={(e) => setForm({ ...form, gemeente: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Postcode</label>
            <input type="number" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} className="input-field" required />
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn-primary flex-1">Toevoegen</button>
          <button type="button" onClick={() => navigate('/locaties')} className="btn-secondary flex-1">Annuleren</button>
        </div>
      </form>
    </div>
  );
}
