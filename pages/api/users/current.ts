import middleware from "middleware";
import User from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET api/users/current
// Returns current user
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const user = await User.findById(session.user.id)
      .select("_id image name isAdmin")
      .lean();

    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to get current user",
    });
  }
});

export default handler;
