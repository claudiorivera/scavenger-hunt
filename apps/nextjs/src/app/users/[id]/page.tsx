import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { User } from "~/app/users/[id]/user";

export default async function UserPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) return redirect("/api/auth/signin");

  return <User id={params.id} />;
}
