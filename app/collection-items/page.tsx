import { redirect } from "next/navigation";

import prisma from "@/util/prisma";

interface CollectionItemsPageParams {
  searchParams: {
    itemId?: string;
    userId?: string;
  };
}

export default async function CollectionItemsPage({
  searchParams,
}: CollectionItemsPageParams) {
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

  return <div>CollectionItemsPage</div>;
}
