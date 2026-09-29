import express from "express";
import { getMe, signup, login } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);

export default router;
