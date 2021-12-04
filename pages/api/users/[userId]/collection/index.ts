import middleware from "middleware";
import { CollectionItem } from "models";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET /api/users/:userId/collection
// Returns collection items for the given user id
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const collectionItems = await CollectionItem.where("user")
      .equals(req.query.userId)
      .select("thumbnailUrl item")
      .populate("item", "itemDescription")
      .lean();

    res.json(collectionItems);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to fetch user's collection",
    });
  }
});

export default handler;
