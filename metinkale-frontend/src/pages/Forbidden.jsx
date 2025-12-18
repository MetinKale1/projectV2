import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-8xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl text-white mb-2">Geen Toegang</h2>
        <p className="text-white/60 mb-8">
          Je hebt geen rechten om deze pagina te bekijken.
        </p>
        <button onClick={() => navigate('/', { replace: true })} className="btn-primary">
          Terug naar Home
        </button>
      </div>
    </div>
  );
}
