import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import "databases/init.mongodb";

const app = express();

// Init middleware
app.use(morgan("dev"));
app.use(helmet());

// Init db

// Init routes
app.get("/", (req, res, next) => {
  return res.status(500).json({
    message: "Hello Man",
  });
});
// Handling error

export default app;
