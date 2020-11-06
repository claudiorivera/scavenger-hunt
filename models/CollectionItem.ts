import { model, models, Schema, Types } from "mongoose";
import { ICollectionItem } from "types";

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
