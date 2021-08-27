import middleware from "middleware";
import { Item } from "models";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items/:id
// Returns the item with the given id
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const item = await Item.findById(req.query.id)
      .select("-__v")
      .populate("usersWhoCollected", "_id image name")
      .populate("addedBy", "_id image name")
      .lean();

    res.json(item);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Item not found",
    });
  }
});

export default handler;
