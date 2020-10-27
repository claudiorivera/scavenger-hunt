import middleware from "@middleware";
import User from "@models/User";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged");
    const users = await User.find()
      .select("_id name itemsCollected image name")
      .lean();
    const sortedUsers = users.sort(
      (a, b) => b.itemsCollected.length - a.itemsCollected.length
    );
    res.json(sortedUsers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Unable to get users",
    });
  }
});

export default handler;
