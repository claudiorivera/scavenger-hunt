import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	collectionItem,
	hunt,
	item,
	participation,
	Role,
	user,
} from "@/db/schema";
import type { Hunt, Item, User, UserInsertInput } from "@/db/types";
import { auth } from "@/lib/auth";

const USERS_TO_CREATE = 10;
const HUNTS_TO_CREATE = 3;
const ITEMS_PER_HUNT = 3;

export async function seed() {
	console.log("Wiping database...");
	await db.delete(user);

	console.log("Creating collection items...");
	await createCollectionItems();
}

async function createCollectionItems() {
	const collectionItemsData = await generateCollectionItemsData();

	return db.insert(collectionItem).values(collectionItemsData);
}

async function generateCollectionItemsData() {
	const users = await createUsers(USERS_TO_CREATE);

	const { user: demoUser } = await auth.api.signUpEmail({
		body: {
			name: "Demo User",
			email: "demo@example.com",
			password: "password1234",
		},
	});

	await db
		.update(user)
		.set({
			role: Role.demo,
			image: faker.image.avatar(),
		})
		.where(eq(user.id, demoUser.id));

	const hunts = await createHunts(users, HUNTS_TO_CREATE);
	const createdById = faker.helpers.arrayElement(users).id;
	const items = await createItems(hunts, ITEMS_PER_HUNT, createdById);
	const participations = await createParticipations(hunts, users);

	return participations.flatMap((participation) =>
		faker.helpers
			.arrayElements(
				items.filter((item) => item.huntId === participation.huntId),
				faker.number.int({
					min: 0,
					max: ITEMS_PER_HUNT,
				}),
			)
			.map((item: Item) => ({
				userId: participation.userId,
				itemId: item.id,
				url: faker.image.urlPicsumPhotos({ height: 640, width: 640 }),
				height: 640,
				width: 640,
				huntId: participation.huntId,
			})),
	);
}

async function createUsers(numberOfUsers: number) {
	return db
		.insert(user)
		.values(generateManyUserCreateInputs(numberOfUsers))
		.onConflictDoNothing()
		.returning();
}

function generateManyUserCreateInputs(numberOfUsers: number) {
	return [...Array(numberOfUsers)].map(generateUserCreateInput);
}

function generateUserCreateInput(): UserInsertInput {
	return {
		id: createId(),
		email: faker.internet.email(),
		image: faker.image.avatar(),
		name: faker.person.fullName(),
		role: Role.demo,
	};
}

async function createHunts(users: Array<User>, count: number) {
	const shuffledUsers = faker.helpers.shuffle(users);
	const selectedUsers = shuffledUsers.slice(0, Math.min(count, users.length));

	return db
		.insert(hunt)
		.values(
			selectedUsers.map((user) => ({
				createdById: user.id,
			})),
		)
		.returning();
}

async function createItems(
	hunts: Array<Hunt>,
	itemsPerHunt: number,
	createdById: string,
) {
	return db
		.insert(item)
		.values(
			hunts.flatMap((hunt) =>
				Array.from({ length: itemsPerHunt }, () => ({
					description: generateItemDescription(),
					huntId: hunt.id,
					createdById,
				})),
			),
		)
		.returning();
}

function generateItemDescription() {
	const article = faker.helpers.arrayElement([
		"One",
		"Some",
		"My",
		"Your",
		"The",
		"Our",
		"That",
		"Their",
	]);
	const adjective = faker.word.adjective();
	const noun = faker.word.noun();

	return `${article} ${capitalizeEveryWord(`${adjective} ${noun}`)}`;
}

function capitalizeEveryWord(string: string) {
	return string
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

async function createParticipations(hunts: Array<Hunt>, users: Array<User>) {
	return db
		.insert(participation)
		.values(
			hunts.flatMap((hunt) =>
				users.map((user) => ({ huntId: hunt.id, userId: user.id })),
			),
		)
		.returning();
}
