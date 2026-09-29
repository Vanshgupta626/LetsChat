import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { email, password, full_name, username, profile_picture } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Invalid" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash: hash,
      full_name: full_name || "",
      username: username || email.split("@")[0],
      profile_picture: profile_picture || "",
    });
    return res.json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Invalid" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success: false, message: "Unauthorized" });
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || "letschat_secret", { expiresIn: "7d" });
    return res.json({ success: true, token, user });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("followers")
      .populate("following")
      .populate("connections");
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
