import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    // GET api/items/:id
    // Returns the item with the given id
    case "GET": {
      const item = await prisma.item.findUnique({
        where: {
          id: req.query.id as string,
        },
      });

      return res.json(item);
    }
  }
};

export default handler;
