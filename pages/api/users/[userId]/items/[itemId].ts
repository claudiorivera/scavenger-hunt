import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET /api/users/:userId/items/:itemId
// Returns collection item for the given user id
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const item = await CollectionItem.findOne()
      .where("user")
      .equals(req.query.userId)
      .where("item")
      .equals(req.query.itemId)
      .select("imageUrl user -_id item")
      .populate("user", "_id name")
      .populate("item", "_id itemDescription usersWhoCollected")
      .lean();
    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to fetch user's collection item",
    });
  }
});

export default handler;
