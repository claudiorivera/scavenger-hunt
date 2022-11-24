"use client";
import { Item } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";

interface DeleteItemProps {
  id: Item["id"];
}

export function DeleteItem({ id }: DeleteItemProps) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/items/${id}`);
    },
    onSuccess: () => {
      router.push("/items");
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
      Delete this Item
    </button>
  );
}
