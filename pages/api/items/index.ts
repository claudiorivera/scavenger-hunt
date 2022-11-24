import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import { getUserBySession } from "@/util/getUserBySession";
import prisma from "@/util/prisma";
import { withAuthentication } from "@/util/withAuthentication";

import { authOptions } from "../auth/[...nextauth]";

interface SaveToDbParams {
  description: string;
}

async function saveToDb({ description }: SaveToDbParams) {
  return prisma.item.create({
    data: {
      description,
    },
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session) return res.status(401).end();

      const user = await getUserBySession(session);

      if (!user) return res.status(401).end();

      if (!user.isAdmin) return res.status(401).end();

      const { description } = req.body;

      const { id } = await saveToDb({
        description,
      });

      return res.status(201).json({ id });
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
