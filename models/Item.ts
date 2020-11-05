import { model, models, Schema, Types } from "mongoose";
import { IItem } from "types";

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
