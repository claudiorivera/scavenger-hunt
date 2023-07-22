"use client";

import { useRouter } from "next/navigation";
import classNames from "classnames";

import type { CollectionItem } from "@claudiorivera/db";

import { api } from "~/utils/api";

export function DeleteCollectionItem({ id }: { id: CollectionItem["id"] }) {
  const router = useRouter();

  const { mutate: deleteCollectionItem, isLoading } =
    api.collectionItems.delete.useMutation({
      onSuccess: () => {
        router.refresh();
        router.push("/leaderboard");
      },
    });

  return (
    <button
      className={classNames("btn-error btn", {
        loading: isLoading,
      })}
      onClick={() => deleteCollectionItem(id)}
      disabled={isLoading}
    >
      Delete this Collection Item
    </button>
  );
}
