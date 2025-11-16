import express, { ErrorRequestHandler } from "express";
import cors from "cors";

import articlesRouter from "./routes/articles";
import authsRouter from "./routes/auths";
import usersRouter from "./routes/users";

const app = express();

const corsOrigins = [
  /^http:\/\/localhost/,           // pour le local
  "http://amazing.you.com",       // autre front local/test
  process.env.VITE_FRONTEND_URL   // ton frontend déployé sur Vercel
].filter((v): v is string | RegExp => typeof v === "string" || v instanceof RegExp);

const corsOptions = {
  origin: corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

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