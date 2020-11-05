import { Document, Types } from "mongoose";

export interface ILinks {
  title: string;
  url: string;
}

export interface IUser extends Document {
  name: string;
  image: string;
  isAdmin: boolean;
  itemsCollected: Types.Array<ICollectionItem>;
}

export interface IItem extends Document {
  itemDescription: string;
  addedBy: IUser["_id"];
  usersWhoCollected: Types.Array<IUser>;
}

export interface ICollectionItem extends Document {
  imageUrl: string;
  thumbnailUrl: string;
  user: IUser["_id"];
  item: IItem["_id"];
}
