import { model, models, Schema, Types, Document, PopulatedDoc } from "mongoose";
import { Item } from "./Item";
import { User } from "./User";

export interface CollectionItem {
  _id: Types.ObjectId;
  imageUrl: string;
  thumbnailUrl: string;
  user: PopulatedDoc<User & Document>;
  item: PopulatedDoc<Item & Document>;
}

const CollectionItemSchema = new Schema<CollectionItem>({
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
  model<CollectionItem>("CollectionItem", CollectionItemSchema);
