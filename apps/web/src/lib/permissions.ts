// https://github.com/WebDevSimplified/permission-system/issues/1#issue-2709020454
import type { CollectionItem, Hunt, Item, Role, User } from "@claudiorivera/db";

type Permissions = {
	deleteItem: (item: Item) => boolean;
	addItemToHunt: (hunt: Hunt) => boolean;
	deleteHunt: (hunt: Hunt) => boolean;
	deleteCollectionItem: (collectionItem: CollectionItem) => boolean;
	deleteUser: (user: User) => boolean;
};

type PermissionsFactoryMap = {
	[key in Role]: (user: User) => Permissions;
};

const permissionsFactoryMap: PermissionsFactoryMap = {
	ADMIN: (user: User) => ({
		deleteItem: () => true,
		addItemToHunt: () => true,
		deleteHunt: () => true,
		deleteCollectionItem: () => true,
		deleteUser: (userToDelete) => userToDelete.id !== user.id,
	}),
	USER: (user: User) => ({
		deleteItem: (item) => item.createdById === user.id,
		addItemToHunt: (hunt) => hunt.createdById === user.id,
		deleteHunt: (hunt) => hunt.createdById === user.id,
		deleteCollectionItem: (collectionItem) => collectionItem.userId === user.id,
		deleteUser: () => false,
	}),
};

export function can(user: User): Permissions {
	const userRolePermission = permissionsFactoryMap[user.role](user);

	return new Proxy({} as Permissions, {
		get(_target, action: keyof Permissions) {
			// biome-ignore lint/suspicious/noExplicitAny: required for accepting any entity type
			return (data: any) => userRolePermission[action](data);
		},
	});
}
