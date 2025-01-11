import { auth } from "@claudiorivera/auth";
import { db } from "@claudiorivera/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getInitials } from "~/lib/get-initials";

export default async function UserPage(props: {
	params: Promise<{ id: string }>;
}) {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	const { id } = await props.params;

	const user = await db.user.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			collectionItems: {
				include: {
					item: true,
				},
			},
		},
	});

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar className="h-24 w-24">
					<AvatarImage src={user.image ?? undefined} />
					<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
				</Avatar>
				<header className="text-5xl">{user.name}</header>
				<div className="text-2xl">Found the Following Items:</div>
			</div>
			<ul className="flex flex-wrap justify-center gap-2">
				{user.collectionItems.map((collectionItem) => (
					<Link
						key={collectionItem.id}
						href={`/collection-items/${collectionItem.id}`}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Avatar>
									<AvatarImage src={collectionItem.url} />
								</Avatar>
							</TooltipTrigger>
							<TooltipContent className="bg-black">
								{collectionItem.item.description}
							</TooltipContent>
						</Tooltip>
					</Link>
				))}
			</ul>
		</div>
	);
}
