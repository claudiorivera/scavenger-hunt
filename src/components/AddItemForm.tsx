"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Input } from "~/components";
import { useZodForm } from "~/hooks/useZodForm";

const addItemSchema = z.object({
  description: z.string(),
});

type PostItemParams = z.infer<typeof addItemSchema>;

export function AddItemForm() {
  const router = useRouter();

  const {
    mutate: addItem,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: PostItemParams) => axios.post("/api/items", data),
    onSuccess: () => {
      router.refresh();
    },
  });

  const { register, handleSubmit, reset } = useZodForm({
    schema: addItemSchema,
  });

  if (isError)
    return (
      <div>
        {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  return (
    <div className="flex flex-col gap-4 items-center">
      <form
        id="add-item"
        onSubmit={handleSubmit((values) => {
          addItem(values);
          reset();
        })}
        className="flex flex-col gap-2 w-full"
      >
        <Input {...register("description")} placeholder="Something Awesome" />
        <button
          type="submit"
          className={classNames("btn btn-secondary", {
            loading: isLoading,
          })}
          disabled={isLoading}
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
