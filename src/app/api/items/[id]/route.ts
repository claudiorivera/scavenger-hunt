import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

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

    const deletedItem = await prisma.item.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(deletedItem, { status: 200 });
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
