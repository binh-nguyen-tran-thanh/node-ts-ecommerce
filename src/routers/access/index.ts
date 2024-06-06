import express from "express";

import accessController from "controllers/access.controller";

const router = express.Router();

router.post("/shop/sign-up", accessController.signUp);

export default router;
