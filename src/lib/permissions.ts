// https://github.com/WebDevSimplified/permission-system/issues/1#issue-2709020454

import z4 from "zod/v4";
import type { SessionUser } from "@/lib/auth-client";
import { Role } from "@/server/db/schema";
import type { CollectionItem, Hunt, Item } from "@/server/db/types";

type Permissions = {
	deleteItem: (item: Item) => boolean;
	addItemToHunt: (hunt: Hunt) => boolean;
	deleteHunt: (hunt: Hunt) => boolean;
	deleteCollectionItem: (collectionItem: CollectionItem) => boolean;
	deleteUser: (user: SessionUser) => boolean;
	viewAdminPanel: () => boolean;
};

type PermissionsFactoryMap = {
	[role in keyof typeof Role]: (user: SessionUser) => Permissions;
};

const permissionsFactoryMap: PermissionsFactoryMap = {
	admin: (user: SessionUser) => ({
		deleteItem: () => true,
		addItemToHunt: () => true,
		deleteHunt: () => true,
		deleteCollectionItem: () => true,
		deleteUser: (userToDelete) => userToDelete.id !== user.id,
		viewAdminPanel: () => true,
	}),
	user: (user: SessionUser) => ({
		deleteItem: (item) => item.createdById === user.id,
		addItemToHunt: (hunt) => hunt.createdById === user.id,
		deleteHunt: (hunt) => hunt.createdById === user.id,
		deleteCollectionItem: (collectionItem) => collectionItem.userId === user.id,
		deleteUser: () => false,
		viewAdminPanel: () => false,
	}),
	demo: () => ({
		deleteItem: () => false,
		addItemToHunt: () => false,
		deleteHunt: () => false,
		deleteCollectionItem: () => false,
		deleteUser: () => false,
		viewAdminPanel: () => false,
	}),
};

export function can(user: SessionUser): Permissions {
	const role = z4.enum(Role).parse(user.role);

	const userRolePermission = permissionsFactoryMap[role](user);

	return new Proxy({} as Permissions, {
		get(_target, action: keyof Permissions) {
			// biome-ignore lint/suspicious/noExplicitAny: required for accepting any entity type
			return (data: any) => userRolePermission[action](data);
		},
	});
}
