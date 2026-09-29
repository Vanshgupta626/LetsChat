import express from "express";
import { follow, listPending, listConnections } from "../controllers/connections.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/follow/:id", auth, follow);
router.get("/pending", auth, listPending);
router.get("/:userId", listConnections);

export default router;
