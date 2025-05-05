import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Post } from '@/types';

interface FeaturedPost {
  id: number;
  post: Post;
  featured_at: string;
  is_active: boolean;
}

export function useFeaturedPosts() {
  return useQuery<FeaturedPost[]>({
    queryKey: ['featuredPosts'],
    queryFn: async () => {
      const { data } = await api.get('/featured-posts');
      return data;
    },
  });
} 