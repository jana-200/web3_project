interface Article {
    id: number;
    title: string;
    author: string;
    date: string;
    content: string;
    cover: string;
    excerpt: string;
    category: string;
}

interface ArticleContextType {
    articles: Article[];
    loginUser: (user: User) => Promise<void>;
    authenticatedUser: AuthenticatedUser | undefined;
    clearUser: () => void;
}

interface User {
    username: string;
    password: string;
}

interface AuthenticatedUser {
    username: string;
    token: string;
}

  type MaybeAuthenticatedUser = AuthenticatedUser | undefined;

  export type {
    Article,
    ArticleContextType,
    User,
    AuthenticatedUser,
    MaybeAuthenticatedUser
  }