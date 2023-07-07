import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HiUserCircle } from "react-icons/hi";

import { getUserBySession } from "~/lib/getUserBySession";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session?.user?.email) return redirect("/api/auth/signin");

  const user = await getUserBySession(session);

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center">
        <div className="avatar">
          <div className="w-24 h-24 rounded-full relative">
            {user.image ? (
              <Image src={user.image} fill alt={`${user.name}`} sizes="33vw" />
            ) : (
              <HiUserCircle className="h-full w-full" />
            )}
          </div>
        </div>
        <header className="text-2xl">{user.name}</header>
        <div className="flex flex-col gap-2 w-full">
          <Link href={"/collect"} className="btn btn-secondary">
            Collect Items
          </Link>
          <Link href={"/leaderboard"} className="btn btn-secondary">
            Leaderboard
          </Link>
          <Link href={"/items"} className="btn btn-secondary">
            View Items
          </Link>
          <Link href={"/profile"} className="btn btn-secondary">
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
