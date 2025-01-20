import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import type { Hunt, Prisma, User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const db =
	globalForPrisma.prisma ??
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

const USERS_TO_CREATE = 3;
const HUNTS_TO_CREATE = 3;
const ITEMS_PER_HUNT = 3;

export async function seed() {
	console.log("Wiping database...");
	await db.user.deleteMany();

	console.log("Creating collection items...");
	await createCollectionItems();
}

function generateUserCreateInput(): Prisma.UserCreateInput {
	return {
		id: createId(),
		email: faker.internet.email(),
		emailVerified: faker.date.past(),
		image: faker.image.avatar(),
		name: faker.person.fullName(),
		isDemoUser: true,
	};
}

function generateManyUserCreateInputs(numberOfUsers: number) {
	return [...Array(numberOfUsers)].map(generateUserCreateInput);
}

async function createUsers(numberOfUsers: number) {
	return db.user.createManyAndReturn({
		data: generateManyUserCreateInputs(numberOfUsers),
		skipDuplicates: true,
	});
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

async function createHunts(users: Array<User>, count: number) {
	return db.hunt.createManyAndReturn({
		data: [...Array(count)].map(() => ({
			createdById: faker.helpers.arrayElement(users).id,
		})),
	});
}

async function createParticipations(hunts: Array<Hunt>, users: Array<User>) {
	return db.participation.createManyAndReturn({
		data: hunts.flatMap((hunt) =>
			users.map((user) => ({ huntId: hunt.id, userId: user.id })),
		),
	});
}

async function createItems(
	hunts: Array<Hunt>,
	itemsPerHunt: number,
	createdById: string,
) {
	return db.item.createManyAndReturn({
		data: hunts.flatMap((hunt) =>
			[...Array(itemsPerHunt)].map(() => ({
				description: generateItemDescription(),
				huntId: hunt.id,
				createdById,
			})),
		),
	});
}

async function createCollectionItems() {
	const collectionItemsData = await generateCollectionItemsData();

	return db.collectionItem.createMany({
		data: collectionItemsData,
	});
}

async function generateCollectionItemsData() {
	console.log("Creating users...");
	const users = await createUsers(USERS_TO_CREATE);
	console.log("Creating hunts...");
	const hunts = await createHunts(users, HUNTS_TO_CREATE);
	console.log("Creating items...");
	const createdById = faker.helpers.arrayElement(users).id;
	const items = await createItems(hunts, ITEMS_PER_HUNT, createdById);
	console.log("Creating participations...");
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
			.map((item) => ({
				userId: participation.userId,
				itemId: item.id,
				url: faker.image.urlPicsumPhotos({ height: 640, width: 640 }),
				height: 640,
				width: 640,
			})),
	);
}

function capitalizeEveryWord(string: string) {
	return string
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
