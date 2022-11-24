"use client";
import { useMutation } from "@tanstack/react-query";
import classNames from "classnames";
import { Input } from "components";
import { useZodForm } from "hooks/useZodForm";
import { useRouter } from "next/navigation";
import { z } from "zod";

const addItemSchema = z.object({
  description: z.string(),
});

type PostItemParams = z.infer<typeof addItemSchema>;

export default function AddItemForm() {
  const router = useRouter();

  async function postItem(data: PostItemParams) {
    return fetch(`/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  const {
    mutate: addItem,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: postItem,
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
        className="flex flex-col gap-2"
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
