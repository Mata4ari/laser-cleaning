// client/src/services/portfolioService.ts
const API_URL = '/api/portfolio';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await fetch(API_URL);
  console.log("RESPONSE: ", response);
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio items');
  }
  console.log("RESPONSE: ", response.json());
  return response.json();
};

export const createPortfolioItem = async (item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
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
  });
  if (!response.ok) {
    throw new Error('Failed to delete portfolio item');
  }
};