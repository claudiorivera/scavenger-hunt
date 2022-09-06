import middleware from "middleware";
import CollectionItem from "models/CollectionItem";
import Item from "models/Item";
import User from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import nextConnect from "next-connect";

import { nextAuthOptions } from "../auth/[...nextauth]";

type ExtendedRequest = {
  session: Session;
};

const handler = nextConnect<NextApiRequest, NextApiResponse>({
  onError: (error, _req, res) => {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).end(error.message);
    } else {
      return res.status(500).end("Something went wrong");
    }
  },
  onNoMatch: (req, res) => {
    return res.status(404).end(`${req.url} not found`);
  },
}).use<{
  session: Session;
}>(async (req, res, next) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session) return res.status(401).end("Unauthorized");
  req.session = session;
  next();
});

handler.use(middleware);

// GET api/collectionitems
// Returns all collection items
handler.get(async (req, res) => {
  try {
    const collectionItems = await CollectionItem.find()
      .select("_id thumbnailUrl")
      .populate("item", "itemDescription")
      .lean();

    res.json(collectionItems);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to fetch user's collection",
    });
  }
});

// POST api/collectionitems
// Adds collection item
handler.post<ExtendedRequest>(async (req, res) => {
  try {
    const { imageUrl, thumbnailUrl, item } = req.body;
    const collectionItem = new CollectionItem({
      imageUrl,
      thumbnailUrl,
      item,
      user: req.session.user._id,
    });
    const savedCollectionItem = await collectionItem.save();

    const user = await User.findById(req.session.user._id);
    user.itemsCollected.addToSet(collectionItem);
    await user.save();

    const originalItem = await Item.findById(req.body.item);
    originalItem.usersWhoCollected.addToSet(req.session.user._id);
    await originalItem.save();

    res.status(201).json(savedCollectionItem);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to add item to collection",
    });
  }
});

export default handler;
