import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/Main/App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ArticlesPage from './components/pages/ArticlesPage';
import ArticleDetailPage from './components/pages/ArticleDetailPage';
import LoginPage from './components/pages/LoginPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "articles", element: <ArticlesPage /> },
      { path: "articles/:id", element: <ArticleDetailPage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);