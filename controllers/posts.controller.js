import { Post, User } from "../models/index.js";

export const createPost = async (req, res) => {
  try {
    const owner = await User.findById(req.userId);
    if (!owner) return res.status(404).json({ success: false, message: "User not found" });
    console.log(req.body);

    const imageUrls = req.body.image_urls || ""
    const postType = req.body.post_type || "text";
    const post = await Post.create({
      user: owner._id,
      content: req.body.content || "",
      image_urls: imageUrls,
      post_type: postType,
      likes: [],
    });
    const populated = await Post.findById(post._id).populate("user");
    return res.json({ success: true, post: populated });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFeed = async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    const ids = [me._id, ...me.following];
    const posts = await Post.find({ user: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate("user");
    return res.json({ success: true, posts });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user");
    return res.json({ success: true, posts });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Not found" });
    const hasLiked = post.likes.some((id) => String(id) === String(userId));
    if (hasLiked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId));
    } else {
      post.likes.push(userId);
    }
    await post.save();
    return res.json({ success: true, likes: post.likes });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
