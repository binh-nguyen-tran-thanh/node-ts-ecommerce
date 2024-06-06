import express from "express";

import access from "routers/access";

const router = express.Router();

router.use("/api/v1/", access);

export default router;
