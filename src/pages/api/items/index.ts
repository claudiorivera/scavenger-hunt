import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    // GET api/items
    // Returns all items, or a user's uncollected items if `uncollected` is in query
    case "GET": {
      if ("uncollected" in req.query) {
        const items = await prisma.item.findMany({
          where: {
            collectedItems: {
              none: {
                foundById: session.user.id,
              },
            },
          },
        });

        return res.json(items);
      }

      const items = await prisma.item.findMany({
        include: {
          createdBy: true,
        },
      });

      return res.json(items);
    }

    // POST api/items
    // Adds item and returns the item
    case "POST": {
      const { description } = req.body;
      const item = await prisma.item.create({
        data: {
          description,
          createdBy: {
            connect: { id: session.user.id },
          },
        },
      });

      return res.status(201).json(item);
    }
  }
};

export default handler;
