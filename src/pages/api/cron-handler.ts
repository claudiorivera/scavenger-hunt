import { NextApiRequest, NextApiResponse } from "next";

import { seed } from "~/prisma/seed";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const { authorization } = req.headers;

  if (authorization === `Bearer ${process.env.CRON_SECRET}`) {
    switch (method) {
      case "POST":
        await seed();

        return res.status(204).end();
      default:
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  return res.status(401).end("Unauthorized");
}

export default handler;
