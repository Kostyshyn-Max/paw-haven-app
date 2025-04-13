export interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  authorAvatar?: string;
  date: string | Date;
  tags: string[];
  category: string;
  likes: number;
  comments: number;
  views: number;
  isFeatured: boolean;
  excerpt: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  iconUrl: string;
  postsCount: number;
}