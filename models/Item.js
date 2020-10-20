import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  itemDescription: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usersWithItemCollected: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
