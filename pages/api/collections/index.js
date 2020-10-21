import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import Item from "@models/Item";
import User from "@models/User";
import cloudinary from "cloudinary";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(middleware);

// POST api/collections
// Adds collection item
handler.post(async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    try {
      const { imageDataString } = req.body;
      const image = await cloudinary.v2.uploader.upload(imageDataString, {
        upload_preset: "scavenger-hunt",
      });
      const collectionItem = new CollectionItem({
        itemId: req.body.itemId,
        userId: session.user.id,
        imageUrl: image.secure_url,
      });
      const user = await User.findById(session.user.id);
      const item = await Item.findById(req.body.itemId);
      user.itemsCollected.addToSet(collectionItem);
      item.usersWithItemCollected.addToSet(session.user.id);
      const savedCollectionItem = await collectionItem.save();
      await item.save();
      await user.save();
      res.status(201).json({
        success: true,
        message: "Successfully collected item",
        collectionItemId: savedCollectionItem._id,
        imageUrl: image.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Unable to add item",
      });
    }
  } else {
    res.status(401).json({ success: false, message: "Unauthorized user" });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
