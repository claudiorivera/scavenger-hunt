import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import { getSession } from "next-auth/client";
import nextConnect from "next-connect";
import cloudinary from "cloudinary";
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
        cloudinaryImageUrl: image.url,
      });
      const savedCollectionItem = await collectionItem.save();
      res.status(201).json({
        success: true,
        message: "Successfully added item",
        collectionItemId: savedCollectionItem._id,
        cloudinaryImageUrl: image.url,
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
      sizeLimit: "50mb",
    },
  },
};
