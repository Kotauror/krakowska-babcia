import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Post } from '@/types';

export function usePosts(tags?: string[]) {
  const queryKey = ['posts', tags || []]; 

  return useQuery<Post[]>({
    queryKey: queryKey,
    queryFn: async () => {
      let url = '/posts';
      if (tags && tags.length > 0) {
        const params = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
        url += `?${params}`;
      }
      const { data } = await api.get(url);
      return data;
    },
  });
} 