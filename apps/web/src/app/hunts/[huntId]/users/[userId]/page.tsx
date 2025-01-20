import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getInitials } from "~/lib/get-initials";
import { getUserById } from "~/server/api";

export default async function UserPage(props: {
	params: Promise<{ userId: string; huntId: string }>;
}) {
	const { userId, huntId } = await props.params;

	const user = await getUserById(userId);

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
						href={`/hunts/${huntId}/collection-items/${collectionItem.id}`}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Avatar>
									<AvatarFallback>
										<Skeleton className="h-10 w-10" />
									</AvatarFallback>
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
