import middleware from "middleware";
import { Item } from "models";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items
// Returns all items
handler.get(async (_req: NextApiRequest, res: NextApiResponse) => {
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
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to create new item",
    });
  }
});

export default handler;
