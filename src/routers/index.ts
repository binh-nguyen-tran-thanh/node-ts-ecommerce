import express from "express";
import ApiKeyMiddleware from "middlewares/apiKey.middleware";

import access from "routers/access";

const router = express.Router();

router.use(ApiKeyMiddleware.checkPermissions("777"));
router.use("/api/v1/", access);

export default router;
