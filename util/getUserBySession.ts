import { Session } from "next-auth";

import prisma from "@/util/prisma";

export async function getUserBySession(session: Session) {
  if (!session?.user?.email) return null;

  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });
}
