import { Item, User } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json(
        { message: "Unauthorized" },
        {
          status: 401,
        }
      );

    const user = await getUserBySession(session);

    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { base64, itemId } = await req.json();

    const { url, height, width } = await uploadPhoto({
      base64,
      userId: user.id,
      itemId,
    });

    const collectionItem = await saveToDb({
      url,
      height,
      width,
      itemId,
      userId: user.id,
    });

    return NextResponse.json(collectionItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to add item to collection",
      },
      {
        status: 500,
      }
    );
  }
}
