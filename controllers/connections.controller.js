import { ConnectionRequest, User } from "../models/index.js";

export const follow = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const targetId = req.params.id;
    if (String(me._id) === String(targetId)) return res.status(400).json({ success: false, message: "Invalid" });
    await User.findByIdAndUpdate(me._id, { $addToSet: { following: targetId } });
    await User.findByIdAndUpdate(targetId, { $addToSet: { followers: me._id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listPending = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const requests = await ConnectionRequest.find({ to_user_id: me._id, status: "pending" }).populate("from_user_id");
    const users = requests.map((r) => r.from_user_id);
    return res.json({ pendingRequests: users });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listConnections = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    const followerSet = new Set(user.followers.map((id) => String(id)));
    const mutual = user.following.filter((id) => followerSet.has(String(id)));
    const users = await User.find({ _id: { $in: mutual } });
    return res.json({ connections: users });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
