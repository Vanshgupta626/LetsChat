import express from "express";
import multer from "multer";
import path from "path";
import { listStories, createStory } from "../controllers/stories.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", listStories);
router.post("/", auth, createStory);

export default router;
