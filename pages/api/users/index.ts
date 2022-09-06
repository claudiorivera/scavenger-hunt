import middleware from "middleware";
import User from "models/User";
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

// GET api/users
// Returns all users, sorted by most items collected
handler.get(async (req, res) => {
  try {
    const users = await User.find()
      .select("_id name itemsCollected image name")
      .lean();

    const sortedUsers = users.sort(
      (a, b) => b.itemsCollected.length - a.itemsCollected.length
    );

    res.json(sortedUsers);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to get users",
    });
  }
});

export default handler;
