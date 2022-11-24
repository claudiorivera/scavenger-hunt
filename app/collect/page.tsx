import { Item, User } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_getServerSession } from "next-auth";

import { getUserBySession } from "@/util/getUserBySession";
import prisma from "@/util/prisma";

import { PhotoUpload } from "./PhotoUpload";

async function getUncollectedItemsByUserId(userId: User["id"]) {
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

async function getNextUncollectedItemIdForUserId(
  userId: User["id"],
  currentItemId?: Item["id"]
) {
  const uncollectedItems = await getUncollectedItemsByUserId(userId);

  const itemsExcludingCurrentItem = uncollectedItems.filter(
    (item) => item.id !== currentItemId
  );

  const nextUncollectedItem = itemsExcludingCurrentItem.length
    ? itemsExcludingCurrentItem[0]
    : null;

  return nextUncollectedItem?.id;
}

interface CollectPageParams {
  searchParams?: any; // until this gets fixed: https://github.com/vercel/next.js/issues/42557
}

export default async function CollectPage({ searchParams }: CollectPageParams) {
  const session = await unstable_getServerSession();

  if (!session) return redirect("/api/auth/signin");

  const user = await getUserBySession(session);

  if (!user) return redirect("/api/auth/signin");

  const nextUncollectedItemId = await getNextUncollectedItemIdForUserId(
    user.id
  );

  if (!(nextUncollectedItemId || searchParams.itemId))
    return redirect("/items");

  const itemId = searchParams.itemId || nextUncollectedItemId;

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    select: {
      id: true,
      description: true,
    },
  });

  if (!item) return redirect("/items");

  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl">Find</header>
      <div className="text-5xl">{item.description}</div>
      <PhotoUpload itemId={item.id} />
      <Link
        className="btn btn-secondary"
        href={`/collect?itemId=${nextUncollectedItemId}`}
      >
        Skip It!
      </Link>
      <Link className="btn btn-secondary" href={`/items/${item.id}`}>
        See who found this
      </Link>
    </div>
  );
}
