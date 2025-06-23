type Tag = {
  id: string;
  name: string;
  created_at: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string | null;
  destination: string;
  longitude: number;
  latitude: number;
  is_featured: boolean
  tags: Tag[];
}; 