import { User } from "models";
import mongoose from "mongoose";

import dbConnect from "./dbConnect";

const users = [
  {
    name: "Demo User",
    email: "demo@example.com",
    image: "https://picsum.photos/seed/demo/100/100",
  },
];

export const seedDb = async () => {
  await dbConnect();
  await User.deleteMany();
  await User.insertMany(users);
  await mongoose.connection.close();
};
