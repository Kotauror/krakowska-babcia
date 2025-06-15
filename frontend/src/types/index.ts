export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  destination: string;
  longitude: number;
  latitude: number;
  content_images: Array<{
    url: string;
    alt: string;
  }>;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  author: {
    id: number;
    username: string;
    full_name: string;
  };
  tags: { name: string }[];
}

export interface FeaturedPost {
  id: number;
  post: Post;
  featured_at: string;
  is_active: boolean;
} 