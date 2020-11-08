import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import Item from "@models/Item";
import User from "@models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET api/collectionitems
// Returns all collection items
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const items = await CollectionItem.find()
      .select("_id thumbnailUrl")
      .populate("item", "itemDescription")
      .lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to fetch user's collection",
    });
  }
});

// POST api/collectoinitems
// Adds collection item
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const { imageUrl, thumbnailUrl, item } = req.body;
    const collectionItem = new CollectionItem({
      imageUrl,
      thumbnailUrl,
      item,
      user: session.user.id,
    });
    const savedCollectionItem = await collectionItem.save();
    const user = await User.findById(session.user.id);
    user.itemsCollected.addToSet(collectionItem);
    await user.save();
    const originalItem = await Item.findById(req.body.item);
    originalItem.usersWhoCollected.addToSet(session.user.id);
    await originalItem.save();
    res.status(201).json(savedCollectionItem);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to add item to collection",
    });
  }
});

export default handler;
