import { User } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/app/api/auth/[...nextauth]/auth-options";

import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";

async function uploadPhoto({
  base64,
  userId,
}: {
  base64: string;
  userId: User["id"];
}) {
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await getUserBySession(session);

    if (!user || params.id !== user.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { base64, name } = await req.json();

    let imageUrl: string | undefined = undefined;

    if (base64) {
      const { url } = await uploadPhoto({ base64, userId: user.id });
      imageUrl = url;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        image: imageUrl,
      },
    });

    return NextResponse.json(updatedUser, {
      status: 200,
    });
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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await getUserBySession(session);

    if (!user?.isAdmin)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (user.id === params.id)
      return NextResponse.json({ message: "Not allowed" }, { status: 400 });

    const deletedUser = await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(deletedUser, { status: 200 });
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
