import middleware from "middleware";
import Item from "models/Item";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import nextConnect from "next-connect";

import { nextAuthOptions } from "../auth/[...nextauth]";

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

// GET api/items/:id
// Returns the item with the given id
handler.get(async (req, res) => {
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
