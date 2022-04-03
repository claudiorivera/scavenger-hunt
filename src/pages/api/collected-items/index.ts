import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    // GET api/collected-items
    // Returns all collection items, or a specific ones if query is provided
    case "GET": {
      if ("itemId" in req.query && "userId" in req.query) {
        const collectedItem = await prisma.collectedItem.findFirst({
          where: {
            originalItemId: req.query.itemId as string,
            foundById: req.query.userId as string,
          },
          include: {
            originalItem: true,
            foundBy: true,
          },
        });

        return res.json(collectedItem);
      }

      if ("userId" in req.query) {
        const collectedItems = await prisma.collectedItem.findMany({
          where: {
            foundById: req.query.userId as string,
          },
          include: {
            foundBy: true,
          },
        });
        return res.json(collectedItems);
      }

      if ("itemId" in req.query) {
        const collectedItems = await prisma.collectedItem.findMany({
          where: {
            originalItemId: req.query.itemId as string,
          },
          include: {
            originalItem: {
              include: {
                createdBy: true,
              },
            },
            foundBy: true,
          },
        });
        return res.json(collectedItems);
      }

      const collectedItems = await prisma.collectedItem.findMany({
        include: {
          originalItem: true,
        },
      });

      return res.json(collectedItems);
    }

    case "POST": {
      // POST api/collected-items
      // Adds collected item
      const { imageUrl, thumbnailUrl, itemId } = req.body;

      const collectedItem = await prisma.collectedItem.create({
        data: {
          imageUrl: imageUrl,
          thumbnailUrl: thumbnailUrl,
          foundBy: {
            connect: {
              id: session.user.id,
            },
          },
          originalItem: {
            connect: {
              id: itemId,
            },
          },
        },
      });

      return res.status(201).json(collectedItem);
    }
  }
};

export default handler;
