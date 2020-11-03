import middleware from "@middleware";
import User from "@models/User";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// GET api/user/userId
// Returns the given user
handler.get(async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");
    const user = await User.findById(req.query.userId)
      .select("_id image name")
      .lean();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to get user",
    });
  }
});

// PUT api/user/userId
// Updates the user with the given id and returns that user
handler.put(async (req, res) => {
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
