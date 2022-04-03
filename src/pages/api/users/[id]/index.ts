import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    // GET api/users/:id
    // Returns the given user
    case "GET": {
      const user = await prisma.user.findUnique({
        where: {
          id: req.query.id as string,
        },
        include: {
          collectedItems: {
            include: {
              originalItem: true,
            },
          },
        },
      });

      return res.json(user);
    }

    // PUT api/users/:id
    // Updates the user with the given id and returns that user
    case "PUT": {
      const { name, image } = req.body;
      const user = await prisma.user.update({
        where: {
          id: req.query.id as string,
        },
        data: {
          name,
          image,
        },
      });

      return res.json(user);
    }

    // DELETE api/users/:id
    // Deletes the user with the given id (and associated records)
    case "DELETE": {
      const user = await prisma.user.delete({
        where: {
          id: req.query.id as string,
        },
      });

      return res.json(user);
    }
  }
};
export default handler;
