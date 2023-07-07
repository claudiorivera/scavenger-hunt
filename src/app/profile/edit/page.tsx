import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { ProfileForm } from "~/components";
import { getUserBySession } from "~/lib/getUserBySession";

export default async function EditProfilePage() {
  const session = await getServerSession();

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
