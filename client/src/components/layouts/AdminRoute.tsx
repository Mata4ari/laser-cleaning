// components/AdminRoute.tsx
import { JSX, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin', { state: { from: location } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading || !isAuthenticated) {
    return <div>Проверка доступа...</div>;
  }

  return children;
}