import { notFound, redirect } from "next/navigation";
import { unstable_getServerSession } from "next-auth";

import { getUserBySession } from "@/util/getUserBySession";

import ProfileForm from "./ProfileForm";

export default async function EditProfilePage() {
  const session = await unstable_getServerSession();

  if (!session?.user?.email) return redirect("/api/auth/signin");

  const user = await getUserBySession(session);

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
