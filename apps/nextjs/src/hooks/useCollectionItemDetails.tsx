import { api, type RouterOutputs } from "~/utils/api";

export const useCollectionItemDetails = ({
	id,
	currentUser,
}: {
	id: string;
	currentUser?: RouterOutputs["user"]["me"];
}) => {
	const { data: collectionItem, isLoading } =
		api.collectionItem.byId.useQuery(id);

	const title =
		!!collectionItem?.user?.name && !!collectionItem.item?.description
			? `${collectionItem.user.name} has found ${collectionItem.item.description}!`
			: "Loading...";

	const isUncollectedByCurrentUser = !(currentUser?.collectionItems ?? []).some(
		(item) =>
			!!collectionItem?.item?.id && item.itemId === collectionItem.item.id,
	);

	const isCurrentUserCollectionItemOwner =
		!!collectionItem?.user &&
		!!currentUser?.id &&
		collectionItem.user.id === currentUser.id;

	return {
		collectionItem,
		title,
		isUncollectedByCurrentUser,
		isCurrentUserCollectionItemOwner,
		isLoading,
	};
};