import middleware from "middleware";
import CollectionItem from "models/CollectionItem";
import Item from "models/Item";
import User from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/collectionitems/:id
// Returns the collection item with the given id
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const collectionItem = await CollectionItem.findById(req.query.id).lean();

    res.json(collectionItem);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Collection item not found",
    });
  }
});

// DELETE api/collectionitems/:id
// Deletes the collection item with the given id
handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const collectionItem = await CollectionItem.findById(req.query.id);
    const originalItem = await Item.findById(collectionItem.item);
    const user = await User.findById(collectionItem.user);

    originalItem.usersWhoCollected.pull(user._id);
    user.itemsCollected.pull(collectionItem._id);

    await originalItem.save();
    await user.save();
    await collectionItem.remove();

    res.json({ message: "Successfully deleted collection item" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Item not found",
    });
  }
});

export default handler;
