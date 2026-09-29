import express from "express";
import { createPost, getFeed, getUserPosts, toggleLike } from "../controllers/posts.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, createPost);
router.get("/feed", auth, getFeed);
router.get("/user/:userId", getUserPosts);
router.post("/:postId/like", auth, toggleLike);

export default router;
