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
  content_images: Array<{
    url: string;
    alt_text?: string;
    caption?: string;
  }>;
  created_at: string;
  updated_at: string;
  author: User;
}

export interface FeaturedPost {
  id: number;
  post: Post;
  featured_at: string;
  is_active: boolean;
} 