import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { EditProfile } from "~/app/profile/edit/edit-profile";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session) return redirect("/api/auth/signin");

  return <EditProfile />;
}
