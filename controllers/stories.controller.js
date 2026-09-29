import { Story, User } from "../models/index.js";

export const listStories = async (req, res) => {
  try {
    const stories = await Story.find({}).sort({ createdAt: -1 }).populate("user");
    return res.json({ success: true, stories: [{ stories }] });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createStory = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });

    console.log(req.body)
    
    const { media_url, media_type } = req.body;
    
    const story = await Story.create({
      user: me._id,
      content: req.body.content || "",
      media_url: media_url || "",
      media_type: media_type || "text",  // Default to "text" for text-only stories
      background_color: req.body.background_color || "#4f46e5",
    });
    return res.json({ success: true, story });
  } catch (error) {
    console.error("Create story error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
