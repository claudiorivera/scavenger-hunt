import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import type { Prisma } from "@prisma/client";
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

function generateManyUserCreateInputs(numOfUsers: number) {
	return Array.from({ length: numOfUsers }, generateUserCreateInput);
}

async function createUsers(numOfUsersToCreate: number) {
	return db.user.createMany({
		data: generateManyUserCreateInputs(numOfUsersToCreate),
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

	return `${capitalizeEveryWord(`${article} ${adjective} ${noun}`)}`;
}

export async function seed() {
	const USERS_TO_CREATE = 8;
	const ITEMS_TO_CREATE = 20;

	console.log("Wiping database...");
	await db.user.deleteMany();

	console.log("Creating users...");
	await createUsers(USERS_TO_CREATE);

	const [users, huntCreator] = await Promise.all([
		db.user.findMany(),
		db.user.findFirstOrThrow(),
	]);

	console.log("Creating hunt and items...");
	const hunt = await db.hunt.create({
		data: {
			createdBy: {
				connect: {
					id: huntCreator.id,
				},
			},
			items: {
				createMany: {
					data: [...Array(ITEMS_TO_CREATE)].map(() => ({
						description: generateItemDescription(),
					})),
				},
			},
			participants: {
				createMany: {
					data: users.map((user) => ({
						userId: user.id,
					})),
				},
			},
		},
	});

	const items = await db.item.findMany({
		where: {
			huntId: hunt.id,
		},
	});

	console.log("Creating collection items...");
	for (const item of items) {
		const numberOfUsersToConnect = faker.number.int({
			min: 0,
			max: users.length,
		});

		const usersToConnect = faker.helpers
			.shuffle(users)
			.slice(0, numberOfUsersToConnect);

		await Promise.all(
			usersToConnect.map((user) =>
				db.collectionItem.create({
					data: {
						item: {
							connect: {
								id: item.id,
							},
						},
						user: {
							connect: {
								id: user.id,
							},
						},
						url: faker.image.urlPicsumPhotos({
							height: 640,
							width: 640,
						}),
						height: 640,
						width: 640,
					},
				}),
			),
		);
	}
}

function capitalizeEveryWord(string: string) {
	return string
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
