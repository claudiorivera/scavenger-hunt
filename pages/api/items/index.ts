import middleware from "@middleware";
import Item from "@models/Item";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items
// Returns all items
// GET api/items?uncollected
// Returns the user's uncollected items
// GET api/items?collected
// Returns the user's collected items
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  if ("uncollected" in req.query) {
    try {
      const session = await getSession({ req });
      if (!session) throw new Error("User not logged in");
      const uncollectedItems = await Item.where("usersWhoCollected")
        .ne(session.user.id)
        .select("-addedBy -__v -usersWhoCollected")
        .lean();
      res.json(uncollectedItems);
    } catch (error) {
      res.status(500).json({
        message: error.message || "Unfound items not found",
      });
    }
  } else if ("collected" in req.query) {
    try {
      const session = await getSession({ req });
      if (!session) throw new Error("User not logged in");
      const collectedItems = await Item.where("usersWhoCollected")
        .equals(session.user.id)
        .select("-addedBy -__v -usersWhoCollected")
        .lean();
      res.json(collectedItems);
    } catch (error) {
      res.status(500).json({
        message: error.message || "Collected items not found",
      });
    }
  } else {
    try {
      const items = await Item.find().lean();
      res.json(items);
    } catch (error) {
      res.status(500).json({
        message: error.message || "Items not found",
      });
    }
  }
});

// POST api/items
// Adds item and returns the item
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const { itemDescription } = req.body;
    const item = new Item({
      itemDescription,
      addedBy: session.user.id,
    });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to add item",
    });
  }
});

export default handler;
