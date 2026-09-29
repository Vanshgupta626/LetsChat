import express from "express";
import { getByDbId, getFollowers, getFollowing, updateMe, discoverUsers, searchUsers } from "../controllers/users.controller.js";
import auth from "../middlewares/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === "profile_picture" ? path.join("uploads", "profile") : path.join("uploads", "cover");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });
// upload.fields([{ name: "profile_picture", maxCount: 1 }, { name: "cover_photo", maxCount: 1 }])

// Specific routes MUST come before parameterized :id routes
router.get("/search", auth, searchUsers);
router.get("/discover", auth, discoverUsers);
router.patch("/me", auth, updateMe);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
// Keep this last to avoid catching other routes
router.get("/:id", getByDbId);

export default router;
