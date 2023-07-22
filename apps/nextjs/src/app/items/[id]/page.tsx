import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { Item } from "~/app/items/[id]/item";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) return redirect("/api/auth/signin");

  return <Item id={params.id} />;
}
