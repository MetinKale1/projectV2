import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-white/60">Uitloggen...</p>
    </div>
  );
}
