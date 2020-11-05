import { newUsersAdminByDefault } from "@config";
import { model, models, Schema, Types } from "mongoose";
import { IUser } from "types";

const UserSchema: Schema = new Schema({
  // _id: Schema.Types.ObjectId, // TODO: Do we need this line??
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

export default models.User || model<IUser>("User", UserSchema);
