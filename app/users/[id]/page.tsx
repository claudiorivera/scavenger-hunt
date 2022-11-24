import Image from "next/image";
import Link from "next/link";
import { HiUserCircle } from "react-icons/hi";

import prisma from "@/util/prisma";

interface UserPageParams {
  params: {
    id: string;
  };
}
export default async function UserPage({ params }: UserPageParams) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      collectionItems: {
        select: {
          id: true,
          url: true,
          item: {
            select: {
              description: true,
            },
          },
        },
      },
      name: true,
      image: true,
    },
  });

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full relative">
            {user.image ? (
              <Image src={user.image} fill alt={`${user.name}`} sizes="33vw" />
            ) : (
              <HiUserCircle className="h-16 w-16" />
            )}
          </div>
        </div>
        <header className="text-5xl">{user.name}</header>
        <div className="text-2xl">Found the Following Items:</div>
      </div>
      <ul className="flex flex-wrap gap-2 justify-center">
        {user.collectionItems.map((collectionItem) => (
          <Link
            key={collectionItem.id}
            href={`/collection-items/${collectionItem.id}`}
          >
            <li
              className="avatar tooltip"
              data-tip={`${collectionItem.item.description}`}
            >
              <div className="w-14 h-14 rounded-full relative">
                <Image
                  src={collectionItem.url}
                  fill
                  alt={`${user.name}`}
                  sizes="33vw"
                />
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
