import { Item, User } from "@prisma/client";
import { redirect } from "next/navigation";

import prisma from "~/lib/prisma";

type Props = {
  searchParams: {
    itemId: Item["id"];
    userId: User["id"];
  };
};

export default async function CollectionItemsPage({ searchParams }: Props) {
  const { itemId, userId } = searchParams;

  if (itemId && userId) {
    const collectionItem = await prisma.collectionItem.findFirst({
      where: {
        userId,
        itemId,
      },
      select: {
        id: true,
      },
    });

    if (collectionItem)
      return redirect(`/collection-items/${collectionItem.id}`);
  }

  return redirect("/items");
}
