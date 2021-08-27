import middleware from "middleware";
import { CollectionItem, Item, User } from "models";
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to update user",
    });
  }
});

// DELETE api/users/:userId
// Deletes the user with the given id
handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession({ req });
    if (!session) throw new Error("User not logged in");

    const user = await User.findById(req.query.userId);
    const collectionItems = await CollectionItem.where("user").equals(user._id);
    collectionItems.forEach(async (collectionItem) => {
      await collectionItem.remove();
    });

    const items = await Item.where("usersWhoCollected").equals(user._id);
    items.forEach(async (item) => {
      item.usersWhoCollected.pull(user._id);
      await item.save();
    });

    await user.remove();

    res.json({ message: "Successfully deleted user" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Unable to update user",
    });
  }
});

export default handler;
