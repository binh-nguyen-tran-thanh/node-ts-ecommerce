import express from "express";

import accessController from "controllers/access.controller";
import { ErrorResponseMiddleware } from "middlewares/errorResponse.middleware";
import AuthenticationMiddleware from "middlewares/authentication.middleware";

const router = express.Router();

router.post(
  "/shop/sign-up",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signUp)
);

router.post(
  "/shop/sign-in",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signIn)
);

router.use(AuthenticationMiddleware.checkAuthentication);
router.post(
  "/shop/sign-out",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signOut)
);

router.post(
  "/shop/refresh-token",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.refreshToken)
);

export default router;
