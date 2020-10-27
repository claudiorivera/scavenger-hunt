import mongoose from "mongoose";

const CollectionItemSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
});

export default mongoose.models.CollectionItem ||
  mongoose.model("CollectionItem", CollectionItemSchema);
