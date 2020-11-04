import { IItem } from "@models/Item";
import { IUser } from "@models/User";
import { Document, model, models, Schema, Types } from "mongoose";

export interface ICollectionItem extends Document {
  imageUrl: string;
  thumbnailUrl: string;
  user: IUser["_id"];
  item: IItem["_id"];
}

const CollectionItemSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  item: {
    type: Types.ObjectId,
    ref: "Item",
    required: true,
  },
});

export default models.CollectionItem ||
  model<ICollectionItem>("CollectionItem", CollectionItemSchema);
