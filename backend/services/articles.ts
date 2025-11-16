import path from "node:path";
import { Article } from "../types";
import { parse } from "../utils/json";

const jsonDbPath = path.join(__dirname, "/../data/articles.json");

const defaultArticles: Article[] = [
  {
    id: 1,
    title: "Project Introduction : Why Real-Time Visitor Tracking?",
    author: "Team Web3",
    date: "2025/11/04",
    category: "Introduction",
    cover: "/images/cover-intro.jpg",
    excerpt: "Why we chose to explore real-time technologies using Socket.io and a microservice-based architecture.",
    content: `
    For this project, we wanted to explore a technology that was not covered in the course but is widely used in modern web development: real-time communication.

    We chose to work with Socket.io and a microservice architecture to build a system capable of tracking website visitors live. Our goal was simple but ambitious: show how many users are currently online and from where they are connecting.

    Real-time features are becoming essential on the web from chat applications to dashboards and analytics tools. By implementing our own real-time tracking system, we gained hands-on experience with client-server event communication, state management, and scalable architecture.

    This project allowed us to build something visual, interactive, and directly useful, while learning how real-time systems work behind the scenes.
    `
    }   ,
    {
    id: 2,
    title: "Technologies Used – Socket.io and Microservices",
    author: "Team Web3",
    date: "2025/11/09",
    category: "Technology",
    cover: "/images/cover-tech.jpg",
    excerpt: "A simple explanation of Socket.io, microservices, and why we combined REST and real-time events.",
    content: `
    Our project relies on a combination of Socket.io, Node.js, and a microservice-based architecture.

    Socket.io is a JavaScript library that enables real-time, bidirectional communication between the client and the server. It allows us to detect when a visitor joins, leaves, or updates their location, and instantly broadcast this information to all connected clients.

    To keep our system modular and scalable, we chose a microservice architecture. Each part of the project has a dedicated responsibility:
    - A microservice that handles real-time visitor tracking via Socket.io
    - A backend API (REST) for persistent data and integration
    - A frontend interface that displays the live statistics

    Using both REST + Socket.io gives us the best of both worlds:  
    REST handles traditional requests, while Socket.io manages everything that must update in real-time. This approach reflects how many professional applications are built today.
    `
    },
  {
  id: 3,
  title: "Main Features of Our Real-Time Tracking System",
  author: "Team Web3",
  date: "2025/11/13",
  category: "Features",
  cover: "/images/cover-features.jpg",
  excerpt: "A quick overview of what our real-time visitor tracking system can do.",
  content: `
Our real-time tracking system includes several key features designed to demonstrate how Socket.io and microservices can work together in a modern web application.

1. Real-time visitor count
The system detects when a user connects or disconnects. Using Socket.io, the visitor count updates live for every connected client without refreshing the page.

2. Geolocation tracking  
The frontend can send the visitor’s approximate location to the microservice. These coordinates can be displayed on an interactive map to show where visitors are connecting from.

3. Easy integration into other projects
Because the visitor tracker runs as an independent microservice, it can be plugged into any web application. The combination of a clear REST API and real-time socket events makes it flexible and reusable, similar to a lightweight version of Google Analytics in real time.

These features demonstrate how real-time systems operate and how microservices help keep a project organized, scalable, and easy to expand.
  `
}

];

function readAllArticles(): Article[] {
  const articles = parse(jsonDbPath, defaultArticles);
  return articles;
}

function readOneArticle(id: number): Article | undefined {
  const articles = parse(jsonDbPath, defaultArticles);
  const article = articles.find((article) => article.id === id);
  return article;
}

export { readAllArticles, readOneArticle };