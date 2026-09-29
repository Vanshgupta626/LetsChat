import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "" },
    image_urls: { type: String },
    post_type: {
      type: String,
      enum: ["text", "image", "text_with_image", "photo"],
      default: "text",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

PostSchema.virtual("likes_count").get(function () {
  return this.likes;
});

export default mongoose.model("Post", PostSchema);

