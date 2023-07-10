"use client";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";

import { TrashIcon } from "~/components";

type Props = {
  id: User["id"];
};

export function DeleteUser({ id }: Props) {
  const router = useRouter();

  const { mutate: deleteUser, isLoading } = useMutation({
    mutationFn: () => axios.delete(`/api/users/${id}`),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <button
      className={classNames("btn btn-error w-12", {
        loading: isLoading,
      })}
      onClick={() => {
        deleteUser();
      }}
      disabled={isLoading}
    >
      <TrashIcon />
    </button>
  );
}
