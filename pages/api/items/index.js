import middleware from "@middleware";
import Item from "@models/Item";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items
// Returns all items
handler.get(async (_, res) => {
  try {
    const items = await Item.find().lean();
    res.json({
      success: true,
      message: "Successfully fetched all items",
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Items not found",
    });
  }
});

// POST api/items
// Adds item and returns the item
handler.post(async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    try {
      const item = new Item({
        itemDescription: req.body.itemDescription,
        addedBy: session.user.id,
      });
      const savedItem = await item.save();
      res.status(201).json({
        success: true,
        message: "Successfully added item",
        item: savedItem,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Unable to add item",
      });
    }
  } else {
    res.status(401).json({ success: false, message: "Unauthorized user" });
  }
});

export default handler;
