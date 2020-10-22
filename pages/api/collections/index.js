import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import Item from "@models/Item";
import User from "@models/User";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";
import axios from "axios";

const handler = nextConnect();
handler.use(middleware);

// POST api/collections
// Adds collection item
handler.post(async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    try {
      const url = "https://api.cloudinary.com/v1_1/claudiorivera/image/upload";
      const response = await axios.post(url, {
        file: req.body.imageDataString,
        upload_preset: "scavenger-hunt",
      });
      const collectionItem = new CollectionItem({
        imageUrl: response.data.secure_url,
        userId: session.user.id,
        itemId: req.body.itemId,
      });
      const savedCollectionItem = await collectionItem.save();
      const user = await User.findById(session.user.id);
      user.itemsCollected.addToSet(collectionItem);
      await user.save();
      const item = await Item.findById(req.body.itemId);
      item.usersWithItemCollected.addToSet(session.user.id);
      await item.save();
      res.status(201).json({
        success: true,
        message: "Successfully collected item",
        collectionItemId: savedCollectionItem._id,
        imageUrl: response.data.secure_url,
      });
      res.json({ success: false, message: "Nope" });
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
      sizeLimit: "50mb",
    },
  },
};
