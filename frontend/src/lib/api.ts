import axios from 'axios';
import type { Post, Destination, User } from '@/types/api';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BABCIA_API}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts
export const getPosts = async (tags?: string[]): Promise<Post[]> => {
  let url = '/posts';
  if (tags && tags.length > 0) {
    const params = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    url += `?${params}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// Destinations
export const getDestinations = async (): Promise<Destination[]> => {
  const response = await api.get('/destinations');
  return response.data;
};

export const getDestination = async (id: number): Promise<Destination> => {
  const response = await api.get(`/destinations/${id}`);
  return response.data;
};

// Users
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export { api }; 