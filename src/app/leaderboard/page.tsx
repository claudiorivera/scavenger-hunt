import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { HiUserCircle } from "react-icons/hi";

import { DeleteUser } from "~/app/leaderboard/DeleteUser";
import { getUserBySession } from "~/lib/getUserBySession";
import prisma from "~/lib/prisma";

export const dynamic = "force-dynamic";

async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      collectionItems: {
        _count: "desc",
      },
    },
    select: {
      _count: {
        select: {
          collectionItems: true,
        },
      },
      id: true,
      image: true,
      name: true,
    },
  });
}

export default async function LeaderboardPage() {
  const session = await getServerSession();

  if (!session) return redirect("/api/auth/signin");

  const currentUser = await getUserBySession(session);

  const users = await getUsers();

  return (
    <div className="flex flex-col gap-4">
      <header className="text-5xl">Leaderboard</header>
      <ul className="flex flex-col gap-4">
        {users.map((user) => (
          <li key={user.id}>
            <Link
              className="flex items-center gap-4"
              href={`/users/${user.id}`}
            >
              {currentUser?.isAdmin && currentUser.id !== user.id && (
                <DeleteUser id={user.id} />
              )}
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
              <div className="flex-1 text-left">{user.name}</div>
              <div>{user._count.collectionItems} items</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
