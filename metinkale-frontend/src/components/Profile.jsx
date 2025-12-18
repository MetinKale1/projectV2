import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import ImageUpload from './ImageUpload';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    voornaam: '',
    achternaam: '',
    emailadres: '',
    profielfoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ FIX: Update form wanneer user data beschikbaar is
  useEffect(() => {
    if (user) {
      setForm({
        voornaam: user.voornaam || '',
        achternaam: user.achternaam || '',
        emailadres: user.emailadres || '',
        profielfoto: user.profielfoto || null,
      });
    }
  }, [user]);

  const handleImageSelect = (base64Image) => {
    setForm({ ...form, profielfoto: base64Image });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:9000/api/klanten/${user.klantID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          voornaam: form.voornaam,
          achternaam: form.achternaam,
          emailadres: form.emailadres,
          profielfoto: form.profielfoto,
        }),
      });

      if (!response.ok) throw new Error('Update failed');

      const updatedUser = await response.json();

      // ✅ FIX: Update form met nieuwe data in plaats van reload
      setForm({
        voornaam: updatedUser.voornaam || '',
        achternaam: updatedUser.achternaam || '',
        emailadres: updatedUser.emailadres || '',
        profielfoto: updatedUser.profielfoto || null,
      });

      setMessage('Profiel succesvol bijgewerkt!');
      
      // ✅ FIX: Verwijder auto-reload, data is al ge-update
      // setTimeout(() => window.location.reload(), 1500);
      
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Kon profiel niet bijwerken');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Wacht tot user data geladen is
  if (!user) {
    return (
      <div className="py-8 max-w-2xl mx-auto">
        <div className="text-center text-white/60">Laden...</div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold gradient-text">Mijn Profiel</h1>
        <p className="text-white/60 mt-2">Pas je profielgegevens aan</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Profielfoto Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FF6B35] bg-gray-900/50 mb-4">
            {form.profielfoto ? (
              <img 
                src={form.profielfoto} 
                alt="Profiel" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FF6B35] to-[#F7C948] flex items-center justify-center">
                <span className="text-5xl text-white font-bold">{form.voornaam?.[0] || '?'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <ImageUpload
          currentImage={form.profielfoto}
          onImageSelect={handleImageSelect}
          label="Profielfoto"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Voornaam</label>
            <input
              type="text"
              value={form.voornaam}
              onChange={(e) => setForm({ ...form, voornaam: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Achternaam</label>
            <input
              type="text"
              value={form.achternaam}
              onChange={(e) => setForm({ ...form, achternaam: e.target.value })}
              className="input-field"
              required
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
            required
          />
        </div>

        {message && (
          <div className={`p-4 rounded-xl ${
            message.includes('succesvol') 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Opslaan...' : 'Opslaan'}
        </button>
      </form>
    </div>
  );
}
