import mongoose from "mongoose";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const randomlyGeneratedName = `${uniqueNamesGenerator({
  dictionaries: [adjectives],
  style: "capital",
})} ${uniqueNamesGenerator({
  dictionaries: [animals],
  style: "capital",
})}`;

const UserSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    default: randomlyGeneratedName,
  },
  image: {
    type: String,
    default: "https://picsum.photos/460",
  },
  isAdmin: {
    type: Boolean,
    default: false,
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
