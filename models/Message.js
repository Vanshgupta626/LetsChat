import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    from_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, default: "" },
    message_type: { type: String, enum: ["text", "image", "video"], default: "text" },
    media_url: { type: String, default: "" },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ from_user_id: 1, to_user_id: 1, createdAt: 1 });

export default mongoose.model("Message", MessageSchema);

