import express from "express";

import accessController from "controllers/access.controller";
import { ErrorResponseMiddleware } from "middlewares/errorResponse.middleware";
import AuthenticationMiddleware from "middlewares/authentication.middleware";
import ApiKeyMiddleware from "middlewares/apiKey.middleware";

const router = express.Router();

router.use(ApiKeyMiddleware.checkPermissions("777"));

router.post(
  "/public/shop/sign-up",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signUp)
);

router.post(
  "/public/shop/sign-in",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signIn)
);

router.use("/private", AuthenticationMiddleware.checkAuthentication);
router.post(
  "/private/shop/sign-out",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.signOut)
);

router.post(
  "/private/shop/refresh-token",
  ErrorResponseMiddleware.errorEscapeWrapper(accessController.refreshToken)
);

export default router;
