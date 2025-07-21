export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
}

export interface Post {
  id: number;
  date_created: string;
  user_created: string;
  tresc: string;
  tytul: string;
  ulubione: boolean;
  zdjecie_glowne: string;
  lokalizacja: string;
  dlugosc_geograficzna: number;
  szerokosc_geograficzna: number;
  kategoria: {
    kategoria_id: {
      id: number;
      nazwa: string;
    }}[];
  // title: string;
  // content: string;
  // slug: string;
  // destination: string;
  // longitude: number;
  // latitude: number;
  // content_images: Array<{
  //   url: string;
  //   alt: string;
  // }>;
  // created_at: string;
  // updated_at: string;
  // is_featured: boolean;
  // author: {
  //   id: number;
  //   username: string;
  //   full_name: string;
  // };
  // tags: { name: string }[];
}

export interface FeaturedPost {
  id: number;
  post: Post;
  featured_at: string;
  is_active: boolean;
} 