import { notFound } from "next/navigation";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";

import prisma from "@/util/prisma";

import ProfileForm from "./ProfileForm";

export default async function EditProfilePage() {
  const session = await unstable_getServerSession(nextAuthOptions);

  if (!session?.user?.email) return notFound();

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      image: true,
      name: true,
    },
  });

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
