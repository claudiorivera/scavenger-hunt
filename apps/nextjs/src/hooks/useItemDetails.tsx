import { api, type RouterOutputs } from "~/utils/api";

export const useItemDetails = ({
	id,
	currentUser,
}: {
	id: string;
	currentUser?: RouterOutputs["user"]["me"];
}) => {
	const { data: users, isLoading: isLoadingUsers } =
		api.user.withItemIdInCollection.useQuery(id);
	const { data: item, isLoading: isLoadingItem } = api.item.byId.useQuery(id);

	const isUncollectedByCurrentUser = !(users ?? []).some(
		(user) => !!currentUser?.email && user.email === currentUser.email,
	);

	const isLoading = isLoadingUsers || isLoadingItem;

	return {
		users,
		item,
		isUncollectedByCurrentUser,
		isLoading,
	};
};
