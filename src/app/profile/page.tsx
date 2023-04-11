import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { HiUserCircle } from "react-icons/hi";

import { getUserBySession } from "~/lib/getUserBySession";

export default async function ProfilePage() {
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
        <Link href={"/profile/edit"} className="btn btn-secondary">
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
