const API_URL = 'http://localhost:5050/api/portfolio';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

// Вспомогательная функция для получения заголовков с токеном
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  const debugClone = response.clone();
  let text = await debugClone.text();
  // console.log("RESPONSE1: ", text);

  if (!response.ok) {
    throw new Error('Failed to fetch portfolio items');
  }
  // console.log("RESPONSE: ", text);
  return response.json();
};

export const createPortfolioItem = async (item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error('Failed to create portfolio item');
  }
  return response.json();
};

export const updatePortfolioItem = async (id: number, item: Partial<PortfolioItem>): Promise<PortfolioItem> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error('Failed to update portfolio item');
  }
  return response.json();
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
