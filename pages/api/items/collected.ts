import middleware from "middleware";
import Item from "models/Item";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items/collected
// Returns the user's collected items
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const collectedItems = await Item.where("usersWhoCollected")
      .equals(session.user.id)
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
