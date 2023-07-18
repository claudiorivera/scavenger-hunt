import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { HiUserCircle } from "react-icons/hi";
import { SignIn } from "~/components";
import { api } from "~/utils/api";

export default function HomePage() {
	const { status } = useSession();

	return (
		<>
			<Head>
				<title>Scavenger Hunt</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</Head>

			{status === "authenticated" ? <Home /> : <SignIn />}
		</>
	);
}

const Home = () => {
	const { data: user } = api.user.me.useQuery();

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
				<div className="flex w-full flex-col gap-2">
					<Link href={"/collect"} className="btn btn-secondary">
						Collect Items
					</Link>
					<Link href={"/leaderboard"} className="btn btn-secondary">
						Leaderboard
					</Link>
					<Link href={"/items"} className="btn btn-secondary">
						View Items
					</Link>
					<Link href={"/profile"} className="btn btn-secondary">
						My Profile
					</Link>
				</div>
			</div>
		</div>
	);
};
