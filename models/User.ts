import { newUsersAdminByDefault } from "@config";
import { User } from "@types";
import { model, models, Schema, Types } from "mongoose";

const UserSchema: Schema = new Schema({
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
    default: newUsersAdminByDefault,
  },
  itemsCollected: [
    {
      type: Types.ObjectId,
      ref: "CollectionItem",
      required: true,
    },
  ],
});

export default models.User || model<User>("User", UserSchema);
