export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: number;
  author: User;
  images: PostImage[];
}

export interface PostImage {
  id: number;
  filename: string;
  file_path: string;
  alt_text: string;
  caption: string;
  image_metadata: Record<string, any>;
  post_id: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  avatar_url: string;
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  posts: Post[];
} 