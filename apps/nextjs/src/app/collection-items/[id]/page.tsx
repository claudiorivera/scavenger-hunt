import { redirect } from "next/navigation";

import { auth } from "@claudiorivera/auth";

import { CollectionItem } from "~/app/collection-items/[id]/collection-item";

export default async function CollectionItemPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) return redirect("/api/auth/signin");

  return <CollectionItem id={params.id} />;
}
