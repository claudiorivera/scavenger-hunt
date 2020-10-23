import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    default: "No Name",
  },
  image: {
    type: String,
    default: "https://picsum.photos/180",
  },
  isAdmin: {
    type: Boolean,
    default: process.env.NODE_ENV !== "production",
  },
  itemsCollected: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollectionItem",
      required: true,
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
