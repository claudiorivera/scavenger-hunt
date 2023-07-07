"use client";
import { Item } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";

type Props = {
  id: Item["id"];
};

export function DeleteItem({ id }: Props) {
  const router = useRouter();

  const { mutate: deleteItem, isLoading } = useMutation({
    mutationFn: () => axios.delete(`/api/items/${id}`),
    onSuccess: () => {
      router.refresh();
      router.push("/items");
    },
  });

  return (
    <button
      className={classNames("btn btn-error", {
        loading: isLoading,
      })}
      onClick={() => {
        deleteItem();
      }}
      disabled={isLoading}
    >
      Delete this Item
    </button>
  );
}
