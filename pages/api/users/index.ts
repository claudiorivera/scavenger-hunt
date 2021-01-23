import middleware from "@middleware";
import User from "@models/User";
import { IUser } from "@types";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET api/users
// Returns all users, sorted by most items collected
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged");
    const users = await User.find()
      .select("_id name itemsCollected image name")
      .lean();
    const sortedUsers = users.sort(
      (a: IUser, b: IUser) => b.itemsCollected.length - a.itemsCollected.length
    );
    res.json(sortedUsers);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to get users",
    });
  }
});

export default handler;
