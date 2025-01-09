"use client";

import type { User } from "@claudiorivera/db";
import { updateProfileSchema } from "@claudiorivera/shared";
import { useRouter } from "next/navigation";
import { LoadingButton } from "~/components/loading-button";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { useImageUpload } from "~/hooks/use-image-upload";
import { useZodForm } from "~/hooks/use-zod-form";
import { api } from "~/utils/api";

export function EditProfile({
	user,
}: {
	user: User;
}) {
	const router = useRouter();
	const utils = api.useContext();

	const { mutateAsync: updateProfile, isLoading } =
		api.users.update.useMutation({
			onSuccess: async () => {
				await utils.users.me.invalidate();
				router.push("/profile");
			},
		});

	const { register, setValue, handleSubmit } = useZodForm({
		schema: updateProfileSchema,
		defaultValues: {
			name: user.name ?? undefined,
		},
	});

	const { image, onFileChange } = useImageUpload({
		initialSrc: user.image,
		onSuccess: (base64) => setValue("base64", base64),
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<form
				id="update-contact"
				onSubmit={handleSubmit(async (values) => await updateProfile(values))}
				className="flex flex-col items-center gap-4"
			>
				<input hidden {...register("base64")} />
				<Avatar className="h-24 w-24">
					<AvatarImage src={image?.src} />
					<label className="absolute right-0 bottom-0 left-0 cursor-pointer">
						<div className="text-transparent hover:bg-secondary/80 hover:text-secondary-foreground">
							Edit
						</div>
						<input
							className="hidden"
							type="file"
							accept="image/*"
							onChange={onFileChange}
						/>
					</label>
				</Avatar>

				<Input
					{...register("name")}
					autoComplete="name"
					placeholder="My Name"
				/>
				<LoadingButton variant="secondary" isLoading={isLoading}>
					Save Changes
				</LoadingButton>
			</form>
		</div>
	);
}
