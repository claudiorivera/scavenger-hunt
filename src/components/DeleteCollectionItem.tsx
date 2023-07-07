"use client";
import { CollectionItem } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";

type Props = {
  id: CollectionItem["id"];
};

export function DeleteCollectionItem({ id }: Props) {
  const router = useRouter();

  const { mutate: deleteCollectionItem, isLoading } = useMutation({
    mutationFn: () => axios.delete(`/api/collection-items/${id}`),
    onSuccess: () => {
      router.refresh();
      router.push("/leaderboard");
    },
  });

  return (
    <button
      className={classNames("btn btn-error", {
        loading: isLoading,
      })}
      onClick={() => deleteCollectionItem()}
      disabled={isLoading}
    >
      Delete this Collection Item
    </button>
  );
}
