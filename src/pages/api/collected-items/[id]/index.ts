import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

import prisma from "~prisma/client";

// DELETE api/collected-items/:id
// Deletes the collection item with the given id
// TODO: only allow admins or collection item owner to delete
const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const collectedItem = await prisma.collectedItem.delete({
    where: {
      id: req.query.id as string,
    },
  });

  return res.json(collectedItem);
};

export default handler;
