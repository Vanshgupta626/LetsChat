import { User } from "../models/index.js";

export const getByDbId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("followers");
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, followers: user.followers });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("following");
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, following: user.following });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  console.log("Search query:", req.query.query);
  try {
    const query = (req.query.query || "").trim();
    console.log("Search query:", query);
    if (!query) return res.json({ success: true, users: [] });
    const regex = new RegExp(query, "i");
    const exclude = req.userId ? { _id: { $ne: req.userId } } : {};
    const users = await User.find({
      ...exclude,
      $or: [
        { full_name: regex },
        { username: regex },
        { bio: regex },
        { location: regex },
      ],
    })
      .select("full_name username profile_picture bio location followers")
      .sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const { page = 1, limit = 20 } = req.query;
    const excludeIds = [me._id, ...me.following];
    const users = await User.find({ _id: { $nin: excludeIds } })
      .select("full_name username profile_picture bio followers location")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    const count = await User.countDocuments({ _id: { $nin: excludeIds } });
    return res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
    });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const updates = {};
    
    if (req.body.username !== undefined) updates.username = req.body.username;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.body.location !== undefined) updates.location = req.body.location;
    if (req.body.full_name !== undefined) updates.full_name = req.body.full_name;
    if( req.body.profile_picture !== undefined) updates.profile_picture = req.body.profile_picture;
    if( req.body.cover_photo !== undefined) updates.cover_photo = req.body.cover_photo;

    const updated = await User.findByIdAndUpdate(me._id, updates, { new: true });
    return res.json({ success: true, user: updated });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
