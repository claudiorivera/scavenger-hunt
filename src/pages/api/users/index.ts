import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    // GET api/users
    // Returns all users, sorted by most items collected
    case "GET": {
      const users = await prisma.user.findMany({
        orderBy: {
          collectedItems: {
            _count: "desc",
          },
        },
        include: {
          collectedItems: true,
        },
      });

      res.json(users);
    }
  }
};

export default handler;
