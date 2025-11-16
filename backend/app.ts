import express, { ErrorRequestHandler } from "express";
import cors from "cors";

import articlesRouter from "./routes/articles";
import authsRouter from "./routes/auths";
import usersRouter from "./routes/users";

const app = express();

const frontendUrl = process.env.VITE_FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: [frontendUrl, /^http:\/\/localhost/],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


app.use((_req, _res, next) => {
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/articles", articlesRouter);
app.use("/auths", authsRouter);
app.use("/users", usersRouter);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  return res.status(500).send("Something broke!");
};

app.use(errorHandler);
export default app;