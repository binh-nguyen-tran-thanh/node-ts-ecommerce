// Dotenv need to import and run first
import dotenv from "dotenv";
dotenv.config();

import express, { urlencoded } from "express";
import morgan from "morgan";
import helmet from "helmet";

import router from "routers";

import "databases/init.mongodb";
import { ErrorResponseMiddleware } from "middlewares/errorResponse.middleware";

const app = express();

// Init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);

// Init db

// Init routes
app.use(router);
// Handling error
app.use(ErrorResponseMiddleware.fourZeroFourError);
app.use(ErrorResponseMiddleware.errorHandler);

export default app;
