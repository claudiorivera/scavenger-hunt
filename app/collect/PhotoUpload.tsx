"use client";
import { Item } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { CheckmarkIcon, TrashIcon } from "components";
import { useZodForm } from "hooks/useZodForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { getBase64FromFile } from "@/util/getBase64FromFile";
import { getHtmlImageElementFromFile } from "@/util/getHtmlImageElementFromFile";

const schema = z.object({
  base64: z.string(),
  itemId: z.string().cuid(),
});

const uploadResponseSchema = z.object({
  id: z.string().cuid(),
});

type ImagePreview = Pick<HTMLImageElement, "src" | "width" | "height">;

export type UploadPhotoData = z.infer<typeof schema>;

interface PhotoUploadProps {
  itemId: Item["id"];
}

export function PhotoUpload({ itemId }: PhotoUploadProps) {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<ImagePreview | undefined>();

  const {
    mutate: uploadPhoto,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: async (uploadPhotoData: UploadPhotoData) => {
      const { data } = await axios.post(
        "/api/collection-items",
        uploadPhotoData
      );
      return uploadResponseSchema.parse(data);
    },
    onSuccess: ({ id }) => {
      router.refresh();
      router.push(`/collection-items/${id}`);
    },
  });

  const { handleSubmit, register, setValue } = useZodForm({
    schema: schema,
    defaultValues: {
      itemId,
    },
  });

  async function onFileChange(event: FormEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!!file) {
      const image = await getHtmlImageElementFromFile(file);
      setImagePreview(image);

      const base64 = await getBase64FromFile(file);

      if (typeof base64 === "string") {
        setValue("base64", base64);
      }
    }
  }

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>;

  return (
    <div className="max-w-sm aspect-square">
      {!imagePreview && (
        <div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
          <label>
            <div className="btn btn-secondary">Select photo</div>
            <input
              {...register("base64")}
              hidden
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>
        </div>
      )}
      {!!imagePreview?.src && (
        <div className="relative h-full w-full overflow-hidden bg-black">
          <Image
            src={imagePreview.src}
            height={imagePreview.height}
            width={imagePreview.width}
            className="h-full w-full object-contain"
            alt=""
          />
          <div className="absolute right-0 bottom-0 left-0">
            <form
              className="flex justify-center p-4 gap-8"
              onSubmit={handleSubmit((values) => {
                uploadPhoto(values);
              })}
            >
              <button
                className={classNames("btn btn-success btn-circle")}
                type="submit"
                disabled={isLoading}
              >
                <CheckmarkIcon />
              </button>
              <button
                type="button"
                className="btn btn-error btn-circle"
                disabled={isLoading}
                onClick={() => {
                  setImagePreview(undefined);
                }}
              >
                <TrashIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
