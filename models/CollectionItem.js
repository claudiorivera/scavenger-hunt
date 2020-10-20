import mongoose from "mongoose";

const CollectionItemSchema = new mongoose.Schema({
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
});

export default mongoose.models.CollectionItem ||
  mongoose.model("CollectionItem", CollectionItemSchema);
