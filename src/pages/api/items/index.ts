import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";
import { withAuthentication } from "~/lib/withAuthentication";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

type SaveToDbParams = {
  description: string;
};

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
      const session = await getServerSession(req, res, authOptions);

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
