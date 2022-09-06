import { faker } from "@faker-js/faker";
import CollectionItem from "models/CollectionItem";
import Item from "models/Item";
import User from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import { capitalizeEachWordOfString } from "util/capitalizeEachWordOfString";
import dbConnect from "util/dbConnect";

const createFakeUsers = () => {
  return Array.from({ length: 10 }, () => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatar(),
    isAdmin: false,
    itemsCollected: [],
  }));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        await dbConnect();

        await User.deleteMany();
        await CollectionItem.deleteMany();
        await Item.deleteMany();

        const fakeUsers = await User.create(createFakeUsers());

        for (let i = 0; i < 5; i++) {
          const adjective = faker.word.adjective();
          const noun = faker.word.noun();

          await Item.create({
            itemDescription: capitalizeEachWordOfString(`${adjective} ${noun}`),
            addedBy:
              fakeUsers[Math.floor(Math.random() * fakeUsers.length)]._id,
          });
        }

        // for every fake item, have a random number of users collect it
        const items = await Item.find();

        for (const item of items) {
          const randomNumberOfFakeUsers = Math.floor(
            Math.random() * fakeUsers.length
          );
          const users = fakeUsers.slice(0, randomNumberOfFakeUsers);

          for (const userIndex in users) {
            await CollectionItem.create({
              item: item._id,
              user: fakeUsers[userIndex]._id,
              imageUrl: `https://picsum.photos/seed/${item._id}-${userIndex}/400/400`,
              thumbnailUrl: `https://picsum.photos/seed/${item._id}-${userIndex}/100/100`,
            });

            item.usersWhoCollected.addToSet(fakeUsers[userIndex]._id);
            await item.save();

            fakeUsers[userIndex].itemsCollected.addToSet(item._id);
            await fakeUsers[userIndex].save();
          }
        }

        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        statusCode: 500,
        message: (err as Error).message || "Something went wrong",
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
