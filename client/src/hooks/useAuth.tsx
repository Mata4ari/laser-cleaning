// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminCredentials {
  email: string;
  phone: string;
  password: string;
}

const ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'admin@example.com',
  phone: '+79991234567',
  password: 'StrongAdminPassword123!'
};

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, phone: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (email !== ADMIN_CREDENTIALS.email) {
        throw new Error('Неверный email');
      }

      if (phone !== ADMIN_CREDENTIALS.phone) {
        throw new Error('Неверный номер телефона');
      }

      if (password !== ADMIN_CREDENTIALS.password) {
        throw new Error('Неверный пароль');
      }

      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
      
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  const logout = useCallback(() => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    navigate('/admin');
  }, [navigate]);

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  };
}