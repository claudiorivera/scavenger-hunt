import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { LoadingButton } from "@/components/loading-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useImageFileHandler } from "@/hooks/use-image-file-handler";
import { getInitials } from "@/lib/utils";
import { useEditProfile } from "@/routes/profile/edit/-hooks/use-edit-profile";

export const Route = createFileRoute("/profile/edit/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/sign-in" });
		}

		return {
			user: context.user,
		};
	},
});

function RouteComponent() {
	const { user } = Route.useRouteContext();

	const { image, onFileChange, base64 } = useImageFileHandler({
		initialSrc: user.image,
	});

	const form = useForm({
		resolver: zodResolver(
			z.object({
				name: z.string().optional(),
				base64: z.string().optional(),
			}),
		),
		defaultValues: {
			name: user.name,
		},
	});

	const { mutate: editProfile, isPending } = useEditProfile();

	useEffect(() => {
		if (base64) {
			form.setValue("base64", base64);
		}
	}, [base64, form]);

	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center">
			<form
				className="flex flex-col items-center gap-4"
				onSubmit={form.handleSubmit((values) => {
					editProfile(
						{
							data: values,
						},
						{
							onSuccess: () => navigate({ to: "/profile" }),
						},
					);
				})}
			>
				<Avatar className="h-24 w-24">
					<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
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
					{...form.register("name")}
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
