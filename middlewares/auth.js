import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export default async function auth(req, res, next) {
  
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET || "letschat_secret");
    const user = await User.findById(payload.userId);
    
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    req.userId = user._id.toString();
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}
