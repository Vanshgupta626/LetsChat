import mongoose from "mongoose";

const ConnectionRequestSchema = new mongoose.Schema(
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
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

ConnectionRequestSchema.index({ from_user_id: 1, to_user_id: 1 }, { unique: true });

export default mongoose.model("ConnectionRequest", ConnectionRequestSchema);

