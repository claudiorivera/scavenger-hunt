import middleware from "@middleware";
import Item from "@models/Item";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items/id
// Returns the item
handler.get(async (req, res) => {
  try {
    const item = await Item.findById(req.query.itemId)
      .select("-__v")
      .populate("usersWhoCollected", "_id image name")
      .populate("addedBy", "_id image name")
      .lean();
    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Item not found",
    });
  }
});

export default handler;
