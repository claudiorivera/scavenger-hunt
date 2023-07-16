"use client";
import { type User } from "@claudiorivera/db";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { z } from "zod";

import { Input } from "~/components";
import { useZodForm } from "~/hooks/useZodForm";
import { base64FromFile } from "~/lib/fileHelpers";

const editProfileSchema = z.object({
	name: z.string().nullish(),
	base64: z.string().nullish(),
});

type Photo = Partial<Pick<HTMLImageElement, "src" | "width" | "height">>;

type EditProfileParams = z.infer<typeof editProfileSchema>;

type Props = {
	user: Partial<User>;
};

export function ProfileForm({ user }: Props) {
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
			router.push("/profile");
		},
	});

	const { register, setValue, handleSubmit } = useZodForm({
		schema: editProfileSchema,
		defaultValues: {
			name: user.name,
		},
	});

	async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (!!event.currentTarget.files?.[0]) {
			const file = event.currentTarget.files[0];

			const image = new Image();
			image.src = URL.createObjectURL(file);
			image.onload = () => {
				setPhoto(image);
			};

			const base64string = await base64FromFile(file);

			if (typeof base64string === "string") {
				setValue("base64", base64string);
			}
		}
	}

	if (isError)
		return (
			<div>
				{error instanceof Error ? error.message : "Something went wrong"}
			</div>
		);

	return (
		<div className="flex flex-col items-center gap-4">
			<form
				id="update-contact"
				onSubmit={handleSubmit((values) => updateProfile(values))}
				className="flex flex-col gap-2"
			>
				<div className="mx-auto">
					<input hidden {...register("base64")} />
					<div className="placeholder avatar">
						<div className="bg-base-300 text-base-content ring-secondary relative w-24 rounded-full ring">
							{!!photo?.src && (
								<NextImage
									src={photo.src}
									alt="avatar"
									height={photo.height}
									width={photo.width}
								/>
							)}
							<div className="absolute bottom-0 left-0 right-0 top-0">
								<div className="flex h-full flex-col justify-end">
									<label className="hover:bg-base-100/80 cursor-pointer text-center">
										<div className="hover:text-secondary text-transparent">
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
