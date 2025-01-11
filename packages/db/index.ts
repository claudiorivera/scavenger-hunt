import { faker } from "@faker-js/faker";
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

	await Promise.all([
		db.user.deleteMany(),
		db.item.deleteMany(),
		db.collectionItem.deleteMany(),
	]);

	await createUsers(USERS_TO_CREATE);

	await Promise.all(
		[...Array(ITEMS_TO_CREATE)].map(() =>
			db.item.create({
				data: {
					description: generateItemDescription(),
				},
			}),
		),
	);

	const [users, items] = await Promise.all([
		db.user.findMany(),
		db.item.findMany(),
	]);

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
							height: 320,
							width: 320,
						}),
						height: 320,
						width: 320,
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
