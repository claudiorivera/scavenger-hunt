import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { Items } from "~/app/items/items";

export default async function ItemsPage() {
  const session = await auth();

  if (!session) return redirect("/api/auth/signin");

  return <Items />;
}
