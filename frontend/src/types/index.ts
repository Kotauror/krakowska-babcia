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
  content_images: Array<{
    url: string;
    alt: string;
  }>;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    full_name: string;
  };
}

export interface FeaturedPost {
  id: number;
  post: Post;
  featured_at: string;
  is_active: boolean;
} 