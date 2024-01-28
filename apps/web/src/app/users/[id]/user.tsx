"use client";

import Image from "next/image";
import Link from "next/link";

import { Avatar } from "~/components/avatar";
import { api } from "~/utils/api";

export const User = ({ id }: { id: string }) => {
	const { data: user } = api.users.byId.useQuery(id);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<Avatar imageSrc={user?.image} size="lg" />
				<header className="text-5xl">{user?.name}</header>
				<div className="text-2xl">Found the Following Items:</div>
			</div>
			<ul className="flex flex-wrap justify-center gap-2">
				{user?.collectionItems.map((collectionItem) => (
					<Link
						key={collectionItem.id}
						href={`/collection-items/${collectionItem.id}`}
					>
						<li
							className="avatar tooltip"
							data-tip={`${collectionItem.item.description}`}
						>
							<div className="relative h-14 w-14 rounded-full">
								<Image
									src={collectionItem.url}
									fill
									alt={`${user.name}`}
									sizes="33vw"
								/>
							</div>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};
