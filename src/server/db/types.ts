import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { collectionItem, hunt, item, user } from "@/server/db/schema";

export type User = InferSelectModel<typeof user>;
export type Item = InferSelectModel<typeof item>;
export type Hunt = InferSelectModel<typeof hunt>;
export type CollectionItem = InferSelectModel<typeof collectionItem>;

export type UserInsertInput = InferInsertModel<typeof user>;
export type HuntInsertInput = InferInsertModel<typeof hunt>;
export type ItemInsertInput = InferInsertModel<typeof item>;
export type CollectionItemInsertInput = InferInsertModel<typeof collectionItem>;
