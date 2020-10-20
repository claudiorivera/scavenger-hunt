import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemDescription: {
    type: String,
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
