import { Item, User } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";
import { withAuthentication } from "~/lib/withAuthentication";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

type UploadPhotoParams = {
  base64: string;
  itemId: Item["id"];
  userId: User["id"];
};

async function uploadPhoto({ base64, itemId, userId }: UploadPhotoParams) {
  try {
    const { secure_url, height, width } = await cloudinary.uploader.upload(
      base64,
      {
        public_id: `user_${userId}-item_${itemId}`,
        folder: "scavenger-hunt/collection-items",
      }
    );

    return { url: secure_url, height, width };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type SaveToDbParams = {
  url: string;
  height: number;
  width: number;
  itemId: Item["id"];
  userId: User["id"];
};

async function saveToDb({
  url,
  height,
  width,
  itemId,
  userId,
}: SaveToDbParams) {
  return prisma.collectionItem.create({
    data: {
      item: {
        connect: {
          id: itemId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      url,
      height,
      width,
    },
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) return res.status(401).end();

      const user = await getUserBySession(session);

      if (!user) return res.status(401).end();

      const { base64, itemId } = req.body;

      const { url, height, width } = await uploadPhoto({
        base64,
        userId: user.id,
        itemId,
      });

      const { id } = await saveToDb({
        url,
        height,
        width,
        itemId,
        userId: user.id,
      });

      return res.status(201).json({ id });
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to add item to collection",
      });
    }
  } else {
    return res.status(405).end();
  }
}

export default withAuthentication(handler);
