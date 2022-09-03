import middleware from "middleware";
import CollectionItem from "models/CollectionItem";
import Item from "models/Item";
import User from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import nextConnect from "next-connect";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";

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

// GET api/users/:userId
// Returns the given user
handler.get(async (req, res) => {
  try {
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
handler.put(async (req, res) => {
  try {
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
handler.delete<ExtendedRequest>(async (req, res) => {
  if (!req.session.user.isAdmin) return res.status(401).end("Unauthorized");

  try {
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
