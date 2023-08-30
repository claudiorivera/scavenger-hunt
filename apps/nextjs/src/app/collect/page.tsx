"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";
import Container from "~/components/Container";
import { ImageUpload } from "~/components/ImageUpload";
import { Loading } from "~/components/Loading";

export default function CollectPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const itemId = searchParams?.get("itemId");

	const [skippedItemIds, setSkippedItemIds] = useState<string[]>([]);

	const { data: item, isLoading } = itemId
		? api.item.byId.useQuery(itemId)
		: api.item.next.useQuery({
				skipItemIds: skippedItemIds,
		  });

	useEffect(() => {
		if (!isLoading && !item && !!skippedItemIds.length) {
			toast("You skipped everything 😅\nTry again!", {
				duration: 4000,
			});
			setSkippedItemIds([]);
		}
	}, [item, skippedItemIds, isLoading]);

	if (isLoading) return <Loading />;

	if (!item) return <AllItemsFound />;

	return (
		<Container>
			<div className="flex flex-col gap-4">
				<header className="text-2xl">Find</header>
				<div className="text-5xl">{item.description}</div>
				<ImageUpload itemId={item.id} />
				<button
					className="btn btn-secondary"
					onClick={() => {
						setSkippedItemIds([...skippedItemIds, item.id]);
						void router.push("/collect");
					}}
				>
					Skip It!
				</button>
				<Link className="btn btn-secondary" href={`/items/${item.id}`}>
					See who found this
				</Link>
			</div>
		</Container>
	);
}

function AllItemsFound() {
	const { data: me } = api.user.me.useQuery();

	return (
		<div className="flex flex-col gap-4">
			<h3>
				You Found All The Items!&nbsp;
				<span role="img" aria-label="celebrate emoji">
					🎉
				</span>
			</h3>
			{!!me?.id && (
				<Link href={`/users/${me.id}`} className="btn btn-secondary">
					My Collection
				</Link>
			)}
		</div>
	);
}
