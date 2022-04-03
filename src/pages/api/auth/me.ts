import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session?.user) return res.status(401).json({ message: "Unauthorized" });

  switch (req.method) {
    // GET api/users/me
    // Returns the session user
    case "GET": {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
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
  }
};
export default handler;
