import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/app/api/auth/[...nextauth]/auth-options";
import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";

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

    const deletedCollectionItem = await prisma.collectionItem.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(deletedCollectionItem, { status: 200 });
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
