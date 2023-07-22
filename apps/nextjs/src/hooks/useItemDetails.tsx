import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

export function useItemDetails({
	id,
	currentUser,
}: {
	id: string;
	currentUser?: RouterOutputs["users"]["me"];
}) {
	const { data: users = [], isLoading: isLoadingUsers } =
		api.users.withItemIdInCollection.useQuery(id);
	const { data: item, isLoading: isLoadingItem } = api.items.byId.useQuery(id);

	const isUncollectedByCurrentUser = !users.some(
		(user) => !!currentUser?.email && user.email === currentUser.email,
	);

	const isLoading = isLoadingUsers || isLoadingItem;

	return {
		users,
		item,
		isUncollectedByCurrentUser,
		isLoading,
	};
}
