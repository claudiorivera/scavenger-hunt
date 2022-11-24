import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import { HiUserCircle } from "react-icons/hi";

import prisma from "@/util/prisma";

export default async function ProfilePage() {
  const session = await unstable_getServerSession(nextAuthOptions);

  if (!session?.user?.email) return notFound();

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      image: true,
      name: true,
    },
  });

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
