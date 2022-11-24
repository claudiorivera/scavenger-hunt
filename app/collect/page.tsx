import Link from "next/link";
import { unstable_getServerSession } from "next-auth";

import prisma from "@/util/prisma";

import { PhotoUpload } from "./PhotoUpload";

async function getUncollectedItemsForUserId(userId: string) {
  return prisma.item.findMany({
    where: {
      collectionItems: {
        none: {
          userId: {
            equals: userId,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });
}

async function getNextUncollectedItemIdForUserId(userId: string) {
  const items = await getUncollectedItemsForUserId(userId);

  const randomItemIndex = Math.floor(Math.random() * items.length);

  const nextUncollectedItem = items[randomItemIndex];

  return nextUncollectedItem.id;
}

interface CollectPageParams {
  searchParams: {
    itemId: string;
  };
}

export default async function CollectPage({ searchParams }: CollectPageParams) {
  const session = await unstable_getServerSession();

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) return null;

  const itemId =
    searchParams.itemId || (await getNextUncollectedItemIdForUserId(user.id));

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    select: {
      id: true,
      description: true,
    },
  });

  if (!item) return null;

  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl">Find</header>
      <div className="text-5xl">{item.description}</div>
      <PhotoUpload userId={user.id} itemId={item.id} />
      <Link href={`/users?filterKey=itemId&filterValue=${searchParams.itemId}`}>
        See who found this
      </Link>
    </div>
  );
}
