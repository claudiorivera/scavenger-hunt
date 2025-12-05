"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { editProfileAction } from "@/app/profile/edit/actions";
import { LoadingButton } from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/use-image-upload";
import type { SessionUser } from "@/lib/auth-client";
import { getInitials } from "@/lib/get-initials";

export function EditProfileForm({ sessionUser }: { sessionUser: SessionUser }) {
	const router = useRouter();

	const { execute, status } = useAction(editProfileAction, {
		onSuccess: () => router.push("/profile"),
	});

	const isPending = status === "executing";

	const { image, onFileChange, base64 } = useImageUpload({
		initialSrc: sessionUser.image,
	});

	return (
		<form className="flex flex-col items-center gap-4" action={execute}>
			<input hidden name="base64" defaultValue={base64} />
			<Avatar className="h-24 w-24">
				<AvatarFallback>{getInitials(sessionUser?.name)}</AvatarFallback>
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
				defaultValue={sessionUser.name ?? undefined}
				autoComplete="name"
				placeholder="My Name"
			/>
			<LoadingButton variant="secondary" isLoading={isPending}>
				Save Changes
			</LoadingButton>
		</form>
	);
}
