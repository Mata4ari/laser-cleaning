const API_BASE_URL = process.env.REACT_APP_BASE_URL ||"http://localhost:5050";
const API_URL = `${API_BASE_URL}/api/portfolio`;

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

// Вспомогательная функция для получения заголовков с токеном
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

const sendFormData = async (url: string, method: string, formData: FormData) => {
  const response = await fetch(url, {
    method,
    headers: getAuthHeaders(true),
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to ${method} portfolio item`);
  }
  
  return response.json();
};

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio items');
  }
  return response.json();
};

export const createPortfolioItem = async (formData: FormData): Promise<PortfolioItem> => {
  return sendFormData(API_URL, 'POST', formData);
};

export const updatePortfolioItem = async (id: number, formData: FormData): Promise<PortfolioItem> => {
  return sendFormData(`${API_URL}/${id}`, 'PUT', formData);
};

export const deletePortfolioItem = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete portfolio item');
  }
};
