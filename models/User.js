import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, trim: true },
    username: { type: String, trim: true, unique: true, sparse: true },
    bio: { type: String, default: "" },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);

