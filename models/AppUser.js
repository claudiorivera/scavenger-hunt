import mongoose from "mongoose";

const AppUserSchema = new mongoose.Schema({
  appUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemsCollected: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollectionItem",
      required: true,
    },
  ],
});

export default mongoose.models.AppUser ||
  mongoose.model("AppUser", AppUserSchema);
