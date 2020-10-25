import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import Item from "@models/Item";
import User from "@models/User";
import axios from "axios";
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
      // Post to Cloudinary using upload preset for items
      // const response = await axios.post(
      //   `${process.env.CLOUDINARY_BASE_URL}/image/upload`,
      //   {
      //     file: req.body.imageDataString,
      //     upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET_ITEMS,
      //   }
      // );
      const collectionItem = new CollectionItem({
        // Create image and thumbnail URLs, dynamically cropped and centered on-the-fly
        // imageUrl:
        //   "https://res.cloudinary.com/" +
        //   process.env.CLOUDINARY_CLOUD_NAME +
        //   "/w_512,h_512,c_fill,g_center,q_auto:best/" +
        //   response.data.public_id,
        // thumbnailUrl:
        //   "https://res.cloudinary.com/" +
        //   process.env.CLOUDINARY_CLOUD_NAME +
        //   "/w_80,h_80,c_fill,g_center,q_auto:best/" +
        //   response.data.public_id,
        imageUrl: req.body.imageUrl,
        thumbnailUrl: req.body.thumbnailUrl,
        user: session.user.id,
        item: req.body.item,
      });
      const savedCollectionItem = await collectionItem.save();
      const user = await User.findById(session.user.id);
      user.itemsCollected.addToSet(collectionItem);
      await user.save();
      const item = await Item.findById(req.body.item);
      item.usersWhoCollected.addToSet(session.user.id);
      await item.save();
      res.status(201).json({
        success: true,
        message: "Successfully collected item",
        savedCollectionItem,
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
