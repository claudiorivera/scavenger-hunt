import { model, models, PopulatedDoc, Schema, Types } from "mongoose";

import { Item } from "./Item";

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image: string;
  isAdmin: boolean;
  itemsCollected: PopulatedDoc<Item & Document>[];
}
const UserSchema = new Schema<User>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  itemsCollected: [
    {
      type: Types.ObjectId,
      ref: "CollectionItem",
    },
  ],
});

export default models.User || model<User>("User", UserSchema);
