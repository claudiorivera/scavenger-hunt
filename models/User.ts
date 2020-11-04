import { newUsersAdminByDefault } from "@config";
import { ICollectionItem } from "@models/CollectionItem";
import { Document, model, models, Schema, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  image: string;
  isAdmin: boolean;
  itemsCollected: [ICollectionItem["_id"]];
}

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
