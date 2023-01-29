import { Item } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

import { getUserBySession } from "@/util/getUserBySession";
import prisma from "@/util/prisma";
import { withAuthentication } from "@/util/withAuthentication";

interface DeleteItemParams {
  id: Item["id"];
}

async function deleteItem({ id }: DeleteItemParams) {
  return prisma.item.delete({
    where: {
      id,
    },
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session) return res.status(401).end();

      const user = await getUserBySession(session);

      if (!user || !user.isAdmin) return res.status(401).end();

      const { id } = req.query;

      if (typeof id !== "string") {
        throw new Error("id must be a string");
      }

      await deleteItem({
        id,
      });

      return res.status(201).end();
    } catch (error) {
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to add item to collection",
      });
    }
  } else {
    return res.status(405).end();
  }
}

export default withAuthentication(handler);
