import { Item, User } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { PhotoUpload } from "~/app/collect/PhotoUpload";
import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";

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

type Props = {
  searchParams: {
    itemId: Item["id"];
  };
};

export default async function CollectPage({ searchParams }: Props) {
  const session = await getServerSession();

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
