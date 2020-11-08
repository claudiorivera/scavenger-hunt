import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import Item from "@models/Item";
import User from "@models/User";
import { ICollectionItem, IItem, IUser } from "@types";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/collectionitems/:id
// Returns the collection item with the given id
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const item = await CollectionItem.findById(req.query.id).lean();
    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Item not found",
    });
  }
});

// DELETE api/collectionitems/:id
// Deletes the collection item with the given id
handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const item: ICollectionItem = await CollectionItem.findById(req.query.id);
    const collectionId: Types.ObjectId = item._id;
    const originalItem: IItem = await Item.findById(item.item);
    const user: IUser = await User.findById(item.user);
    originalItem.usersWhoCollected.pull(user._id);
    user.itemsCollected.pull(collectionId);
    await originalItem.save();
    await user.save();
    await item.remove();
    res.json({ message: "Successfully deleted collection item" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Item not found",
    });
  }
});

export default handler;
