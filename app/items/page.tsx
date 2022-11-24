import { User } from "@prisma/client";
import CheckCircleIcon from "components/CheckCircleIcon";
import MinusCircleIcon from "components/MinusCircleIcon";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";

import prisma from "@/util/prisma";

interface GetUncollectedItemsParams {
  userEmail: User["email"];
}

async function getUncollectedItems({ userEmail }: GetUncollectedItemsParams) {
  if (!userEmail) return [];

  return await prisma.item.findMany({
    where: {
      collectionItems: {
        none: {
          user: {
            email: userEmail,
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

interface GetCollectedItemsParams {
  userEmail: User["email"];
}

async function getCollectedItems({ userEmail }: GetCollectedItemsParams) {
  if (!userEmail) return [];

  return await prisma.item.findMany({
    where: {
      collectionItems: {
        some: {
          user: {
            email: userEmail,
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
  const session = await unstable_getServerSession();

  const uncollectedItems = await getUncollectedItems({
    userEmail: session?.user?.email ?? null,
  });
  const collectedItems = await getCollectedItems({
    userEmail: session?.user?.email ?? null,
  });

  const totalItems = uncollectedItems.length + collectedItems.length;

  return (
    <div className="flex flex-col gap-4">
      <header className="text-5xl">All Items</header>
      <div>
        Found {collectedItems.length} out of {totalItems} items! 📷
      </div>
      <ul className="flex flex-col gap-4">
        {uncollectedItems.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-2">
              <Link
                className="btn btn-secondary flex-1"
                href={`/items/${item.id}`}
              >
                {item.description}
              </Link>
              <div className="text-warning">
                <MinusCircleIcon />
              </div>
            </div>
          </li>
        ))}
        {collectedItems.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-2">
              <Link
                className="btn btn-secondary flex-1"
                href={`/items/${item.id}`}
              >
                {item.description}
              </Link>
              <div className="text-success">
                <CheckCircleIcon />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
