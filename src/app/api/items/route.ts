import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "~/app/api/auth/[...nextauth]/auth-options";
import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";

async function saveToDb({ description }: { description: string }) {
  return prisma.item.create({
    data: {
      description,
    },
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserBySession(session);

    if (!user?.isAdmin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { description } = await req.json();

    const item = await saveToDb({
      description,
    });

    return NextResponse.json(item, { status: 201 });
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
