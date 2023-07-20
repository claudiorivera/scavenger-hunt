import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loading, PhotoUpload, SignIn } from "~/components";
import { api } from "~/utils/api";

export default function CollectPage() {
	const { status } = useSession();

	return status === "authenticated" ? <Collect /> : <SignIn />;
}

const Collect = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const itemId = searchParams.get("itemId");

	const [skippedItemIds, setSkippedItemIds] = useState<Array<string>>([]);

	const { data: item, isLoading } = itemId
		? api.items.byId.useQuery(itemId)
		: api.items.next.useQuery({
				skipItemIds: skippedItemIds,
		  });

	useEffect(() => {
		if (!isLoading && !item && !!skippedItemIds.length) {
			toast.loading("You skipped everything 😅\nTry again!", {
				duration: 4000,
			});
			setSkippedItemIds([]);
		}
	}, [item, skippedItemIds, isLoading]);

	if (isLoading) return <Loading />;

	if (!item) return <AllItemsFound />;

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
};

const AllItemsFound = () => {
	const { data: me } = api.users.me.useQuery();

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
};
