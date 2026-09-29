import { Message, User } from "../models/index.js";

export const getRecent = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const messages = await Message.find({ to_user_id: me._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("from_user_id")
      .populate("to_user_id");
    const shaped = messages.map((m) => ({
      _id: m.from_user_id?._id,
      from_user_id: m.from_user_id,
      to_user_id: m.to_user_id,
      text: m.text,
      message_type: m.message_type,
      media_url: m.media_url,
      seen: m.seen,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      profile_picture: m.from_user_id?.profile_picture,
      full_name: m.from_user_id?.full_name,
      username: m.from_user_id?.username,
      bio: m.from_user_id?.bio,
    }));
    return res.json({ success: true, messages: shaped });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const otherId = req.params.userId;
    const messages = await Message.find({
      $or: [
        { from_user_id: me._id, to_user_id: otherId },
        { from_user_id: otherId, to_user_id: me._id },
      ],
    }).sort({ createdAt: 1 });
    return res.json({ success: true, messages });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const to = req.body.to_user_id;
    const msg = await Message.create({
      from_user_id: me._id,
      to_user_id: to,
      text: req.body.text || "",
      message_type: req.body.message_type || "text",
      media_url: req.body.media_url || "",
    });
    return res.json({ success: true, message: msg });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
