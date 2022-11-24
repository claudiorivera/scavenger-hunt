import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

import { getUserBySession } from "@/util/getUserBySession";
import prisma from "@/util/prisma";
import { withAuthentication } from "@/util/withAuthentication";

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session) return res.status(401).end();

      const user = await getUserBySession(session);

      if (!user || !user.isAdmin) return res.status(401).end();

      const { id } = req.query;

      if (typeof id !== "string") {
        throw new Error("id must be a string");
      }

      if (user.id === id) {
        throw new Error("You cannot delete yourself");
      }

      await deleteUser({
        id,
      });

      return res.status(201).end();
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to add user to collection",
      });
    }
  } else {
    return res.status(405).end();
  }
}

export default withAuthentication(handler);
