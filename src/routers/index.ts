import express from "express";
import ApiKeyMiddleware from "middlewares/apiKey.middleware";

import access from "routers/access";
import product from "routers/product";

const router = express.Router();

router.use(ApiKeyMiddleware.checkPermissions("777"));
router.use("/api/v1/", access);
router.use("/api/v1/", product);

export default router;
