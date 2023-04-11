import { User } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import AddItemForm from "~/app/items/AddItemForm";
import CheckCircleIcon from "~/components/CheckCircleIcon";
import MinusCircleIcon from "~/components/MinusCircleIcon";
import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";

type GetUncollectedItemsParams = {
  userId: User["id"];
};

async function getUncollectedItems({ userId }: GetUncollectedItemsParams) {
  if (!userId) return [];

  return await prisma.item.findMany({
    where: {
      collectionItems: {
        none: {
          user: {
            id: userId,
          },
        },
      },
    },
    select: {
      id: true,
      description: true,
    },
  });
}

type GetCollectedItemsParams = {
  userId: User["id"];
};

async function getCollectedItems({ userId }: GetCollectedItemsParams) {
  if (!userId) return [];

  return await prisma.item.findMany({
    where: {
      collectionItems: {
        some: {
          user: {
            id: userId,
          },
        },
      },
    },
    select: {
      id: true,
      description: true,
    },
  });
}

export default async function ItemsPage() {
  const session = await getServerSession();

  if (!session) return redirect("/api/auth/signin");

  const user = await getUserBySession(session);

  if (!user) return redirect("/api/auth/signin");

  const uncollectedItems = await getUncollectedItems({
    userId: user.id,
  });
  const collectedItems = await getCollectedItems({
    userId: user.id,
  });

  const totalItems = uncollectedItems.length + collectedItems.length;

  return (
    <div className="flex flex-col gap-4">
      <header className="text-5xl">All Items</header>
      {user.isAdmin && <AddItemForm />}
      <div>
        Found {collectedItems.length} out of {totalItems} items! 📷
      </div>
      <ul className="flex flex-col gap-4">
        {uncollectedItems.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-2 relative">
              <Link
                className="btn btn-secondary flex-1"
                href={`/items/${item.id}`}
              >
                {item.description}
              </Link>
              <div className="text-warning absolute -right-8">
                <MinusCircleIcon />
              </div>
            </div>
          </li>
        ))}
        {collectedItems.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-2 relative">
              <Link
                className="btn btn-secondary flex-1"
                href={`/items/${item.id}`}
              >
                {item.description}
              </Link>
              <div className="text-success absolute -right-8">
                <CheckCircleIcon />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
