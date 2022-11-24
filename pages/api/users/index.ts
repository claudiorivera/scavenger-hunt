import { User } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import { getUserBySession } from "@/util/getUserBySession";
import prisma from "@/util/prisma";
import { withAuthentication } from "@/util/withAuthentication";

import { authOptions } from "../auth/[...nextauth]";

interface UploadPhotoParams {
  base64: string;
  userId: User["id"];
}

async function uploadPhoto({ base64, userId }: UploadPhotoParams) {
  try {
    const { secure_url, height, width } = await cloudinary.uploader.upload(
      base64,
      {
        public_id: `${userId}`,
        folder: "scavenger-hunt/profile-photos",
      }
    );

    return { url: secure_url, height, width };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface SaveToDbParams {
  name: string;
  image: string;
  userId: User["id"];
}

async function saveToDb({ name, image, userId }: SaveToDbParams) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      image,
    },
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session) return res.status(401);

      const user = await getUserBySession(session);

      if (!user) throw new Error("User not found");

      const { base64, name } = req.body;

      const { url } = await uploadPhoto({ base64, userId: user.id });

      await saveToDb({
        userId: user.id,
        name,
        image: url,
      });

      res.status(201);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : error,
      });
    }
  } else {
    res.status(405).end();
  }
}

export default withAuthentication(handler);
