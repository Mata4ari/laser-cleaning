// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5050';

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      
      const isJWT = token.split('.').length === 3;
      setIsAuthenticated(isJWT);
    }
    
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Отправляем запрос к вашему NestJS бэкенду
      const response = await axios.post<{ accessToken: string }>(`${BASE_URL}/auth/login`, {
        email,
        password
      });

      // Сохраняем токен из ответа
      localStorage.setItem('token', response.data.accessToken);
      setIsAuthenticated(true);
      
      // Перенаправляем пользователя
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа');
      localStorage.removeItem('token');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location.state]);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  };
}