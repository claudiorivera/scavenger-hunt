"use client";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { TrashIcon } from "components";
import { useRouter } from "next/navigation";

interface DeleteUserProps {
  id: User["id"];
}

export function DeleteUser({ id }: DeleteUserProps) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => axios.delete(`/api/users/${id}`),
    onSuccess: () => {
      router.refresh();
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
      <TrashIcon />
    </button>
  );
}
