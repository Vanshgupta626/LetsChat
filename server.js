import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/auth.route.js";
import usersRoutes from "./routes/users.route.js";
import postsRoutes from "./routes/posts.route.js";
import messagesRoutes from "./routes/messages.route.js";
import storiesRoutes from "./routes/stories.route.js";
import connectionsRoutes from "./routes/connections.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

["uploads", path.join("uploads", "posts"), path.join("uploads", "stories")].forEach((p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});
["uploads/profile", "uploads/cover"].forEach((p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});
app.use("/uploads", express.static("uploads"));

await mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "letschat"
  })
  .then(() => { console.log("Database connected.") })
  .catch(() => { console.log("Error Occur During Connection.") });

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/connections", connectionsRoutes);

app.get("/health", (req, res) => {
  res.send({message:"everything good..."});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

