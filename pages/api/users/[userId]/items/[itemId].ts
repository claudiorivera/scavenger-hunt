import middleware from "middleware";
import CollectionItem from "models/CollectionItem";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import nextConnect from "next-connect";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";

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

// GET /api/users/:userId/items/:itemId
// Returns collection item for the given user id
handler.get(async (req, res) => {
  try {
    const collectionItem = await CollectionItem.findOne()
      .where("user")
      .equals(req.query.userId)
      .where("item")
      .equals(req.query.itemId)
      .select("imageUrl user -_id item")
      .populate("user", "_id name")
      .populate("item", "_id itemDescription usersWhoCollected")
      .lean();

    res.json(collectionItem);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to fetch user's collection item",
    });
  }
});

export default handler;
