"use client";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { Input } from "components";
import { useZodForm } from "hooks/useZodForm";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { z } from "zod";

import { getBase64FromFile } from "@/util/getBase64FromFile";

const editProfileSchema = z.object({
  name: z.string().nullish(),
  base64: z.string().nullish(),
});

type Photo = Partial<Pick<HTMLImageElement, "src" | "width" | "height">>;

type EditProfileParams = z.infer<typeof editProfileSchema>;

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [photo, setPhoto] = useState<Photo>({
    src: user.image ?? undefined,
    height: 100,
    width: 100,
  });

  const {
    mutate: updateProfile,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: EditProfileParams) =>
      axios.put(`/api/users/${user.id}`, data),
    onSuccess: () => {
      router.refresh();
      router.push("/profile");
    },
  });

  const { register, setValue, handleSubmit } = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: user.name,
    },
  });

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!!event.currentTarget.files?.[0]) {
      const file = event.currentTarget.files[0];

      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        setPhoto(image);
      };

      const base64string = await getBase64FromFile(file);

      if (typeof base64string === "string") {
        setValue("base64", base64string);
      }
    }
  };

  if (isError)
    return (
      <div>
        {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );

  return (
    <div className="flex flex-col gap-4 items-center">
      <form
        id="update-contact"
        onSubmit={handleSubmit((values) => {
          updateProfile(values);
        })}
        className="flex flex-col gap-2"
      >
        <div className="mx-auto">
          <input hidden {...register("base64")} />
          <div className="placeholder avatar">
            <div className="relative w-24 rounded-full bg-base-300 text-base-content ring ring-secondary">
              {!!photo?.src && (
                <NextImage
                  src={photo.src}
                  alt="avatar"
                  height={photo.height}
                  width={photo.width}
                />
              )}
              <div className="absolute top-0 right-0 bottom-0 left-0">
                <div className="flex h-full flex-col justify-end">
                  <label className="cursor-pointer text-center hover:bg-base-100/80">
                    <div className="text-transparent hover:text-secondary">
                      Edit
                    </div>
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Input
          {...register("name")}
          autoComplete="name"
          placeholder="My Name"
        />
        <button
          type="submit"
          className={classNames("btn btn-secondary", {
            loading: isLoading,
          })}
          disabled={isLoading}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
