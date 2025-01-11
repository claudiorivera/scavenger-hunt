"use client";

import type { User } from "@claudiorivera/db";
import { useActionState } from "react";
import { editProfile } from "~/app/profile/edit/actions";
import { LoadingButton } from "~/components/loading-button";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { useImageUpload } from "~/hooks/use-image-upload";

export function EditProfile({
	user,
}: {
	user: User;
}) {
	const [_state, action, isPending] = useActionState(editProfile, undefined);

	const { image, onFileChange, base64 } = useImageUpload({
		initialSrc: user.image,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<form
				id="update-contact"
				className="flex flex-col items-center gap-4"
				action={action}
			>
				<input hidden name="base64" defaultValue={base64} />
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
					name="name"
					defaultValue={user.name ?? undefined}
					autoComplete="name"
					placeholder="My Name"
				/>
				<LoadingButton variant="secondary" isLoading={isPending}>
					Save Changes
				</LoadingButton>
			</form>
		</div>
	);
}
