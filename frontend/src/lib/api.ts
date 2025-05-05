import axios from 'axios';
import type { Post, Destination, User } from '@/types/api';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Posts
export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
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

export default api; 