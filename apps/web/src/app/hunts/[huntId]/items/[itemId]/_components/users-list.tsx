import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { getInitials } from "~/lib/get-initials";
import type { UserWithCollectionItems } from "~/server/api";

export function UsersList({
	users,
	itemId,
	huntId,
}: {
	users: Array<UserWithCollectionItems>;
	itemId: string;
	huntId: string;
}) {
	return (
		<ul className="flex flex-col gap-4 pb-4">
			{users.map((user) => {
				const collectionItem = user.collectionItems.find(
					(item) => item.itemId === itemId,
				);

				return (
					<li key={user.id} className="flex items-center gap-4">
						<Link href={`/hunts/${huntId}/users/${user.id}`}>
							<Avatar>
								<AvatarImage src={user.image ?? undefined} />
								<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
							</Avatar>
						</Link>
						<div className="flex-1 text-left">{user.name}</div>
						{!!collectionItem?.id && (
							<Button variant="secondary" asChild>
								<Link
									href={`/hunts/${huntId}/collection-items/${collectionItem?.id}`}
								>
									<EyeIcon />
								</Link>
							</Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}
