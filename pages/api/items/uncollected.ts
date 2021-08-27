import middleware from "middleware";
import { Item } from "models";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(middleware);

// GET api/items/uncollected
// Returns the user's uncollected items
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const uncollectedItems = await Item.where("usersWhoCollected")
      .ne(session.user.id)
      .select("-addedBy -__v -usersWhoCollected")
      .lean();

    res.json(uncollectedItems);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "User's uncollected items not found",
    });
  }
});

export default handler;
