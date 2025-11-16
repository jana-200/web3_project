import { Router } from "express";
import { readAllArticles, readOneArticle } from "../services/articles";

const router = Router();

router.get("/", (_req, res) => {
  const articles = readAllArticles();
  return res.json(articles);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const article = readOneArticle(id);
  if (!article) {
    return res.sendStatus(404);
  }
  return res.json(article);
});

export default router;