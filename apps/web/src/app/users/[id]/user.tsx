"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getInitials } from "~/lib/get-initials";
import { api } from "~/utils/api";

export const User = ({ id }: { id: string }) => {
	const { data: user } = api.users.byId.useQuery(id);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar className="h-24 w-24">
					<AvatarImage src={user?.image ?? undefined} />
					<AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
				</Avatar>
				<header className="text-5xl">{user?.name}</header>
				<div className="text-2xl">Found the Following Items:</div>
			</div>
			<ul className="flex flex-wrap justify-center gap-2">
				{user?.collectionItems.map((collectionItem) => (
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
};
