"use client";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

export function useItemDetails({
	id,
	currentUser,
}: {
	id: string;
	currentUser?: RouterOutputs["user"]["me"];
}) {
	const { data: users = [], isLoading: isLoadingUsers } =
		api.user.withItemIdInCollection.useQuery(id);
	const { data: item, isLoading: isLoadingItem } = api.item.byId.useQuery(id);

	const isUncollectedByCurrentUser = !users.some(
		(user) => !!currentUser?.id && user.id === currentUser.id,
	);

	const isLoading = isLoadingUsers || isLoadingItem;

	return {
		users,
		item,
		isUncollectedByCurrentUser,
		isLoading,
	};
}
