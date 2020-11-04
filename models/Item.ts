import { IUser } from "@models/User";
import { Document, model, models, Schema, Types } from "mongoose";

export interface IItem extends Document {
  itemDescription: string;
  addedBy: IUser["_id"];
  usersWhoCollected: [IUser["_id"]];
}

const ItemSchema = new Schema({
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

export default models.Item || model<IItem>("Item", ItemSchema);
