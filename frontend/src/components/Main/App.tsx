import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';
import socket from "../../visitorTracker";
import { Article, User, AuthenticatedUser, ArticleContextType } from '../../types';

const App = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | undefined>(undefined);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/articles`);
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des articles");
        }
        
        const articlesData: Article[] = await response.json();
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      }
    }
    
    fetchArticles();
  }, []);

  const loginUser = async (user: User): Promise<void> => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      };
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auths/login`, options);
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const authenticatedUser: AuthenticatedUser = await response.json();
      setAuthenticatedUser(authenticatedUser);
      localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
    } catch (err) {
      console.error("loginUser::error: ", err);
      throw err;
    }
  };

  const clearUser = (): void => {
    setAuthenticatedUser(undefined);
    localStorage.removeItem('authenticatedUser');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('authenticatedUser');
    if (storedUser) {
      setAuthenticatedUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    socket.on("visitor-count", (data) => {
      console.log("Visiteurs connectés :", data.count);
    });

    socket.on("all-locations", (data) => {
      console.log("Toutes les positions :", data.visitors);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("location", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }

    socket.emit("get-all-locations");

    return () => {
      socket.off("visitor-count");
      socket.off("all-locations");
    };
  }, []);


  const articleContext: ArticleContextType = {
    articles,
    loginUser,
    authenticatedUser,
    clearUser
  };

  return (
    <div className="app">
      <Header />
      <Navbar authenticatedUser={authenticatedUser} clearUser={clearUser} />
      <main className="main-content">
        <Outlet context={articleContext} />
      </main>
      <Footer />
    </div>
  );
};

export default App;