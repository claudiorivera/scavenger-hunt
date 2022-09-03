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

// GET api/collectionitems/:id
// Returns the collection item with the given id
handler.get(async (req, res) => {
  try {
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
handler.delete<ExtendedRequest>(async (req, res) => {
  if (!req.session.user.isAdmin) return res.status(401).end("Unauthorized");

  try {
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
