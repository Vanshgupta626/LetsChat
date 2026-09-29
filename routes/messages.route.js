import express from "express";
import { getRecent, getConversation, sendMessage } from "../controllers/messages.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/recent", auth, getRecent);
router.get("/:userId", auth, getConversation);
router.post("/", auth, sendMessage);

export default router;
