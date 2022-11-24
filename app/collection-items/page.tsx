import { redirect } from "next/navigation";

import prisma from "@/util/prisma";

interface CollectionItemsPageParams {
  searchParams?: any; // until this gets fixed: https://github.com/vercel/next.js/issues/42557
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
