"use client";
import { CollectionItem } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";

interface DeleteCollectionItemProps {
  id: CollectionItem["id"];
}

export function DeleteCollectionItem({ id }: DeleteCollectionItemProps) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
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
      onClick={() => {
        mutate();
      }}
      disabled={isLoading}
    >
      Delete this Collection Item
    </button>
  );
}
