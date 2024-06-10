import express from "express";

import { ErrorResponseMiddleware } from "middlewares/errorResponse.middleware";
import AuthenticationMiddleware from "middlewares/authentication.middleware";
import ProductController from "controllers/product.controller";

const router = express.Router();

router.use("/private", AuthenticationMiddleware.checkAuthentication);
router.post(
  "/private/product",
  ErrorResponseMiddleware.errorEscapeWrapper(ProductController.addProduct)
);
router.get(
  "/private/product/drafts",
  ErrorResponseMiddleware.errorEscapeWrapper(
    ProductController.getAllDraftProduct
  )
);
router.get(
  "/private/product/published",
  ErrorResponseMiddleware.errorEscapeWrapper(
    ProductController.getAllPublishedProduct
  )
);
router.post(
  "/private/product/published",
  ErrorResponseMiddleware.errorEscapeWrapper(ProductController.publishProduct)
);

router.get(
  "/public/products",
  ErrorResponseMiddleware.errorEscapeWrapper(
    ProductController.searchProductByText
  )
);

export default router;
