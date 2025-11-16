export interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  cover: string;
  excerpt: string;
  category: string;
}

export type NewArticle = Omit<Article, "id">;


export interface AuthenticatedUser {
  username: string;
  token: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
}

export type PotentialUser = Omit<User, "id">;

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
}
