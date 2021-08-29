import { model, models, PopulatedDoc, Schema, Types } from "mongoose";
import { User } from "./User";

export interface Item {
  _id: Types.ObjectId;
  itemDescription: string;
  addedBy: PopulatedDoc<User & Document>;
  usersWhoCollected: PopulatedDoc<User & Document>[];
}
const ItemSchema = new Schema<Item>({
  itemDescription: {
    type: String,
    required: true,
  },
  addedBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  usersWhoCollected: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export default models.Item || model<Item>("Item", ItemSchema);
