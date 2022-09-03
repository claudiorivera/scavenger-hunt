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

// GET api/items/collected
// Returns the user's collected items
handler.get<ExtendedRequest>(async (req, res) => {
  try {
    const collectedItems = await Item.where("usersWhoCollected")
      .equals(req.session.user._id)
      .select("-addedBy -__v -usersWhoCollected")
      .lean();

    res.json(collectedItems);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "User's collected items not found",
    });
  }
});

export default handler;
