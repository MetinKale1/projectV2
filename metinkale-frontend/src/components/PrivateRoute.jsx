
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

export default function PrivateRoute() {
  const { isAuthed, ready } = useAuth();
  const location = useLocation();

  
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/60">Laden...</div>
      </div>
    );
  }

  
  if (!isAuthed) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  
  return <Outlet />;
}

