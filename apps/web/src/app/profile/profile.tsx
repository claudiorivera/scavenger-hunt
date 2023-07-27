"use client";

import Link from "next/link";

import { api } from "~/utils/api";
import { Avatar } from "~/components/Avatar";

export function Profile() {
	const { data: user } = api.users.me.useQuery();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar imageSrc={user?.image} />
				<header className="text-2xl">{user?.name}</header>
				<Link href={"/profile/edit"} className="btn-secondary btn">
					Edit Profile
				</Link>
			</div>
		</div>
	);
}
