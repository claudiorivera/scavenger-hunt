"use client";
import { CheckmarkIcon, TrashIcon } from "components";
import { useZodForm } from "hooks/useZodForm";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { getBase64 } from "@/util/getBase64";
import { getImagePreview } from "@/util/getImagePreview";

interface ImagePreview
  extends Pick<HTMLImageElement, "src" | "width" | "height"> {}

interface UploadParams {
  base64: string;
  filename: string;
  itemId: string;
  userId: string;
}
async function postPhoto({ base64, filename, itemId, userId }: UploadParams) {
  return fetch(`/collection-items`, {
    method: "POST",
    body: JSON.stringify({ base64, filename, itemId, userId }),
  }).then((res) => res.json());
}

export function PhotoUpload() {
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty },
    control,
    setValue,
  } = useZodForm({
    schema: z.object({
      base64Image: z.string(),
    }),
  });

  const [imagePreview, setImagePreview] = useState<ImagePreview | undefined>();

  const onFileChange = async (event: FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!!file) {
      const image = await getImagePreview(file);

      setImagePreview(image);

      const base64Image = await getBase64(file);

      setValue("base64Image", base64Image);
    }
  };

  const handleRemove = () => {
    setImagePreview(undefined);
  };

  async function handleSave() {
    console.log("saving");
  }

  return (
    <div className="w-96 h-96">
      {!imagePreview && (
        <div className="flex h-full w-full items-center justify-center border border-stone-400 bg-stone-100 p-4">
          <label>
            <div className="btn btn-secondary">Select photo</div>
            <input
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
            <div className="flex justify-center p-4 gap-4">
              <button
                className="btn btn-success btn-circle"
                onClick={handleSave}
                isDisabled={isLoading}
              >
                <CheckmarkIcon />
              </button>
              <button
                className="btn btn-error btn-circle"
                onClick={handleRemove}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
