import express from "express";

import { ErrorResponseMiddleware } from "middlewares/errorResponse.middleware";
import AuthenticationMiddleware from "middlewares/authentication.middleware";
import ProductController from "controllers/product.controller";

const router = express.Router();

router.use(AuthenticationMiddleware.checkAuthentication);
router.post(
  "/product",
  ErrorResponseMiddleware.errorEscapeWrapper(ProductController.addProduct)
);

export default router;
