import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { HiUserCircle } from "react-icons/hi";
import { SignIn } from "~/components";
import { api } from "~/utils/api";

export default function ProfilePage() {
	const { status } = useSession();

	return status === "authenticated" ? <Profile /> : <SignIn />;
}

const Profile = () => {
	const { data: user } = api.users.me.useQuery();

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<div className="avatar">
					<div className="relative h-24 w-24 rounded-full">
						{user?.image ? (
							<Image src={user.image} fill alt={`${user.name}`} sizes="33vw" />
						) : (
							<HiUserCircle className="h-full w-full" />
						)}
					</div>
				</div>
				<header className="text-2xl">{user?.name}</header>
				<Link href={"/profile/edit"} className="btn btn-secondary">
					Edit Profile
				</Link>
			</div>
		</div>
	);
};
