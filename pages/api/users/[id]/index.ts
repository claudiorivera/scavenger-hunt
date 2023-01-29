import { User } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

import { getUserBySession } from "@/util/getUserBySession";
import prisma from "@/util/prisma";
import { withAuthentication } from "@/util/withAuthentication";

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

interface DeleteUserParams {
  id: User["id"];
}

async function deleteUser({ id }: DeleteUserParams) {
  return prisma.user.delete({
    where: {
      id,
    },
  });
}

interface SaveToDbParams {
  name?: string;
  image?: string;
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
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json("Invalid id parameter");
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).end();

    const user = await getUserBySession(session);

    if (!user) return res.status(401).end();

    switch (req.method) {
      case "DELETE":
        if (!user?.isAdmin) return res.status(401).end();

        if (user.id === id) {
          throw new Error("You cannot delete yourself");
        }

        try {
          await deleteUser({
            id,
          });

          return res.status(204).end();
        } catch (error) {
          return res.status(500).json({
            message:
              error instanceof Error ? error.message : "Unable to delete user",
          });
        }
      case "PUT":
        if (id !== user.id) return res.status(401).end();

        const { base64, name } = req.body;

        let imageUrl: string | undefined = undefined;

        try {
          if (base64) {
            const { url } = await uploadPhoto({ base64, userId: user.id });
            imageUrl = url;
          }

          await saveToDb({
            userId: user.id,
            name,
            image: imageUrl,
          });

          res.status(204).end();
        } catch (error) {
          return res.status(500).json({
            message:
              error instanceof Error ? error.message : "Unable to edit profile",
          });
        }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export default withAuthentication(handler);
