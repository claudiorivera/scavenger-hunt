import { Item } from "@prisma/client";
import { EyeIcon } from "components/EyeIcon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import { HiUserCircle } from "react-icons/hi";

import prisma from "@/util/prisma";

interface ItemsPageParams {
  params: {
    id: Item["id"];
  };
}

export default async function ItemsPage({ params }: ItemsPageParams) {
  const session = await unstable_getServerSession(nextAuthOptions);

  const users = await prisma.user.findMany({
    where: {
      collectionItems: {
        some: {
          itemId: {
            equals: params.id,
          },
        },
      },
    },
    select: {
      id: true,
      image: true,
      name: true,
      email: true,
    },
  });

  const item = await prisma.item.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      description: true,
    },
  });

  if (!item) return notFound();

  const hasCurrentUserFoundItem = users.some(
    (user) => user.email === session?.user?.email
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="text-5xl">{item.description}</header>
      <div className="text-2xl">Collected By:</div>
      {!users.length && <div className="text-2xl">Nobody, yet 😢</div>}
      {!!users.length && (
        <ul className="flex flex-col gap-4 pb-4">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-4">
              <Link href={`/users/${user.id}`}>
                <div className="avatar">
                  <div className="w-14 h-14 rounded-full relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        fill
                        alt={`${user.name}`}
                        sizes="33vw"
                      />
                    ) : (
                      <HiUserCircle className="h-full w-full" />
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex-1 text-left">{user.name}</div>
              <Link
                className="btn btn-secondary"
                href={`/collection-items?userId=${user.id}&itemId=${item.id}`}
              >
                <EyeIcon />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!hasCurrentUserFoundItem && (
        <Link className="btn btn-secondary" href={`/collect?itemId=${item.id}`}>
          Found It?
        </Link>
      )}
    </div>
  );
}
