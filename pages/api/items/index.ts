import middleware from "middleware";
import Item from "models/Item";
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

// GET api/items
// Returns all items
handler.get(async (_req, res) => {
  try {
    const items = await Item.find().lean();

    res.json(items);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Items not found",
    });
  }
});

// POST api/items
// Adds item and returns the item
handler.post<ExtendedRequest>(async (req, res) => {
  if (!req.session.user.isAdmin) return res.status(401).end("Unauthorized");

  try {
    const { itemDescription } = req.body;
    const item = new Item({
      itemDescription,
      addedBy: req.session.user._id,
    });
    const savedItem = await item.save();

    res.status(201).json(savedItem);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to create new item",
    });
  }
});

export default handler;
