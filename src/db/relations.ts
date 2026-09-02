import { relations } from "drizzle-orm";
import {
	account,
	collectionItem,
	hunt,
	item,
	participation,
	session,
	user,
} from "@/db/schema";

export const userRelations = relations(user, ({ many }) => ({
	collectionItems: many(collectionItem),
	huntsCreated: many(hunt),
	itemsAdded: many(item),
	participations: many(participation),
	sessions: many(session),
	accounts: many(account),
}));

export const collectionItemRelations = relations(collectionItem, ({ one }) => ({
	user: one(user, {
		fields: [collectionItem.userId],
		references: [user.id],
	}),
	item: one(item, {
		fields: [collectionItem.itemId],
		references: [item.id],
	}),
	hunt: one(hunt, {
		fields: [collectionItem.huntId],
		references: [hunt.id],
	}),
}));

export const itemRelations = relations(item, ({ one, many }) => ({
	hunt: one(hunt, {
		fields: [item.huntId],
		references: [hunt.id],
	}),
	collectionItems: many(collectionItem),
	addedBy: one(user, {
		fields: [item.createdById],
		references: [user.id],
	}),
}));

export const huntRelations = relations(hunt, ({ one, many }) => ({
	createdBy: one(user, {
		fields: [hunt.createdById],
		references: [user.id],
	}),
	items: many(item),
	participants: many(participation),
}));

export const participationRelations = relations(participation, ({ one }) => ({
	hunt: one(hunt, {
		fields: [participation.huntId],
		references: [hunt.id],
	}),
	user: one(user, {
		fields: [participation.userId],
		references: [user.id],
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));
