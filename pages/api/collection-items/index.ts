import { Item, User } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/util/prisma";

interface UploadPhotoParams {
  base64: string;
  filename: string;
}

async function uploadPhoto({ base64, filename }: UploadPhotoParams) {
  try {
    const { secure_url, height, width } = await cloudinary.uploader.upload(
      base64,
      {
        public_id: `${filename}`,
        folder: "scavenger-hunt/collection-items",
      }
    );

    return { url: secure_url, height, width };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface SaveToDbParams {
  url: string;
  height: number;
  width: number;
  itemId: Item["id"];
  userId: User["id"];
}

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
    select: {
      id: true,
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { base64, filename, itemId, userId } = req.body;

      const { url, height, width } = await uploadPhoto({ base64, filename });

      const { id } = await saveToDb({ url, height, width, itemId, userId });

      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to add item to collection",
      });
    }
  } else {
    res.status(405).end();
  }
}
