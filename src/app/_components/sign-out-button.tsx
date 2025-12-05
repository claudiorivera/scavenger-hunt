"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
	const router = useRouter();

	return (
		<DropdownMenuItem
			asChild
			onClick={() => {
				signOut({
					fetchOptions: {
						onSuccess: router.refresh,
					},
				});
			}}
		>
			<div className="cursor-pointer">
				<LogOutIcon />
				<span>Sign Out</span>
			</div>
		</DropdownMenuItem>
	);
}
