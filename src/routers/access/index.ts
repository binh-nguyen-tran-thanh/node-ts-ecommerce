import express from "express";

import accessController from "controllers/access.controller";
import { ErrorResponseMiddleware } from "middlewares/errorResponse.middleware";

const router = express.Router();

router.post(
  "/shop/sign-up",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signUp)
);

router.post(
  "/shop/sign-in",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signIn)
);

export default router;
