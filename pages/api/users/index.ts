import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import prisma from "@/util/prisma";

import { nextAuthOptions } from "../auth/[...nextauth]";

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
  email: string;
}

async function saveToDb({ name, image, email }: SaveToDbParams) {
  return prisma.user.update({
    where: {
      email,
    },
    data: {
      name,
      image,
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
  try {
    const session = await unstable_getServerSession(req, res, nextAuthOptions);

    if (!session?.user?.email) return res.status(401).end();

    const { base64, filename, name } = req.body;

    const { url } = await uploadPhoto({ base64, filename });

    const { id } = await saveToDb({
      email: session.user.email,
      name,
      image: url,
    });

    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Unable to save changes",
    });
  }
}
