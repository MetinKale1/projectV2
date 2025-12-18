import { useState } from 'react';
import { useAuth } from '../contexts/auth';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    voornaam: user?.voornaam || '',
    achternaam: user?.achternaam || '',
    emailadres: user?.emailadres || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profiel bijgewerkt! (demo)');
  };

  return (
    <div className="py-8 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7C948] flex items-center justify-center mb-4">
          {user?.profielfoto ? (
            <img src={user.profielfoto} alt="Profiel" className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-4xl text-white">{user?.voornaam?.[0] || '?'}</span>
          )}
        </div>
        <h1 className="font-display text-3xl font-bold gradient-text">Mijn Profiel</h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Voornaam</label>
            <input
              type="text"
              value={form.voornaam}
              onChange={(e) => setForm({ ...form, voornaam: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Achternaam</label>
            <input
              type="text"
              value={form.achternaam}
              onChange={(e) => setForm({ ...form, achternaam: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">E-mailadres</label>
          <input
            type="email"
            value={form.emailadres}
            onChange={(e) => setForm({ ...form, emailadres: e.target.value })}
            className="input-field"
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Opslaan
        </button>
      </form>
    </div>
  );
}
