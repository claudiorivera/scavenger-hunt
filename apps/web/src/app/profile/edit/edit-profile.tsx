"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import classNames from "classnames";

import { updateProfileSchema } from "@claudiorivera/shared";

import { api } from "~/utils/api";
import { base64FromFile } from "~/utils/fileHelpers";
import { Input } from "~/components/Input";
import { useZodForm } from "~/hooks/useZodForm";

export function EditProfile() {
	const router = useRouter();
	const { data: user } = api.users.me.useQuery();

	const [image, setImage] = useState<
		Partial<Pick<HTMLImageElement, "src" | "width" | "height">>
	>({
		src: user?.image ?? undefined,
		height: 100,
		width: 100,
	});

	const { mutate: updateProfile, isLoading } = api.users.update.useMutation({
		onSuccess: () => {
			router.refresh();
			router.push("/profile");
		},
	});

	const { register, setValue, handleSubmit } = useZodForm({
		schema: updateProfileSchema,
		defaultValues: {
			name: user?.name ?? undefined,
		},
	});

	async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
		if (event.currentTarget.files?.[0]) {
			const file = event.currentTarget.files[0];

			const image = new Image();
			image.src = URL.createObjectURL(file);
			image.onload = () => {
				setImage(image);
			};

			const base64string = await base64FromFile(file);

			if (typeof base64string === "string") {
				setValue("base64", base64string);
			}
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<div className="flex flex-col items-center gap-4">
					<form
						id="update-contact"
						onSubmit={handleSubmit((values) => updateProfile(values))}
						className="flex flex-col gap-2"
					>
						<div className="mx-auto">
							<input hidden {...register("base64")} />
							<div className="placeholder avatar">
								<div className="relative w-24 rounded-full bg-base-300 text-base-content ring ring-secondary">
									{!!image?.src && (
										<NextImage
											src={image.src}
											alt="avatar"
											height={image.height}
											width={image.width}
										/>
									)}
									<div className="absolute bottom-0 left-0 right-0 top-0">
										<div className="flex h-full flex-col justify-end">
											<label className="cursor-pointer text-center hover:bg-base-100/90">
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
							className={classNames("btn-secondary btn", {
								loading: isLoading,
							})}
							disabled={isLoading}
						>
							Save Changes
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}