import middleware from "@middleware";
import User from "@models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET api/users/:userId
// Returns the given user
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const user = await User.findById(req.query.userId)
      .select("_id image name isAdmin")
      .lean();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to get user",
    });
  }
});

// PUT api/users/:userId
// Updates the user with the given id and returns that user
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const user = await User.findById(req.query.userId);
    user.name = req.body.name;
    user.image = req.body.image;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to update user",
    });
  }
});

export default handler;
