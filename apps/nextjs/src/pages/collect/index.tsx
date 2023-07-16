import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loading, PhotoUpload } from "~/components";
import { api } from "~/utils/api";

export default function CollectPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const itemId = searchParams.get("itemId");

	const [skippedItemIds, setSkippedItemIds] = useState<Array<string>>([]);

	const { data: item, isLoading } = itemId
		? api.item.byId.useQuery(itemId)
		: api.item.next.useQuery({
				skipItemIds: skippedItemIds,
		  });

	if (isLoading) return <Loading />;

	if (!item) return <div>Item not found</div>;

	return (
		<div className="flex flex-col gap-4">
			<header className="text-2xl">Find</header>
			<div className="text-5xl">{item.description}</div>
			<PhotoUpload itemId={item.id} />
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
	);
}
