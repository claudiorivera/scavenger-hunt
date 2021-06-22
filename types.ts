import { Document, Types } from "mongoose";

export interface Link {
  title: string;
  url: string;
}

export interface User {
  name: string;
  image?: string;
  isAdmin: boolean;
  itemsCollected: Types.Array<CollectionItem>;
  _id: Types.ObjectId;
}

export interface Item {
  itemDescription: string;
  addedBy: User;
  usersWhoCollected: Types.Array<User>;
  _id: Types.ObjectId;
}

export interface CollectionItem {
  imageUrl: string;
  thumbnailUrl: string;
  user: User;
  item: Item;
  _id: Types.ObjectId;
}
