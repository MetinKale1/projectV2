import { useNavigate, useLocation } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl text-white mb-2">Pagina niet gevonden</h2>
        <p className="text-white/60 mb-8">
          Er is geen pagina met url <code className="bg-white/10 px-2 py-1 rounded">{pathname}</code>
        </p>
        <button onClick={() => navigate('/', { replace: true })} className="btn-primary">
          Terug naar Home
        </button>
      </div>
    </div>
  );
}
