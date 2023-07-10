import { CollectionItem } from "@prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { DeleteCollectionItem } from "~/components";
import prisma from "~/lib/prisma";

export const dynamic = "force-dynamic";

async function getCollectionItemById(id: CollectionItem["id"]) {
  return prisma.collectionItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      item: {
        select: {
          id: true,
          description: true,
        },
      },
      url: true,
      height: true,
      width: true,
    },
  });
}

type Props = {
  params: { id: CollectionItem["id"] };
};

export default async function CollectionItemPage({ params }: Props) {
  const session = await getServerSession();

  if (!session?.user?.email) return redirect("/api/auth/signin");

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      collectionItems: {
        select: {
          itemId: true,
        },
      },
      isAdmin: true,
    },
  });

  if (!currentUser) return redirect("/api/auth/signin");

  const collectionItem = await getCollectionItemById(params.id);

  if (!collectionItem?.url) return notFound();

  const title = `${collectionItem.user.name} has found ${collectionItem.item.description}!`;

  const hasCurrentUserCollectedItem = currentUser.collectionItems.some(
    (item) => item.itemId === collectionItem.item.id
  );

  const isCurrentUserCollectionItem = collectionItem.user.id === currentUser.id;

  return (
    <div className="flex flex-col gap-4">
      <header className="text-2xl">{title}</header>
      <div className="max-w-sm aspect-square">
        <Image
          src={collectionItem.url}
          width={collectionItem.width}
          height={collectionItem.height}
          alt={title}
          className="object-contain w-full h-full bg-black"
        />
      </div>
      {!hasCurrentUserCollectedItem && (
        <Link
          className="btn btn-secondary"
          href={`/collect?itemId=${collectionItem.item.id}`}
        >
          Found It Too?
        </Link>
      )}
      {isCurrentUserCollectionItem && (
        <Link className="btn btn-secondary" href={"/collect"}>
          Find More Stuff!
        </Link>
      )}
      <Link
        className="btn btn-secondary"
        href={`/items/${collectionItem?.item.id}`}
      >
        See who found this
      </Link>
      {currentUser.isAdmin && <DeleteCollectionItem id={collectionItem.id} />}
    </div>
  );
}
