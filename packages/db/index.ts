import { faker } from "@faker-js/faker";
import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { capitalizeEveryWord } from "@claudiorivera/shared";

export * from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
	const { count } = await prisma.user.createMany({
		data: generateManyUserCreateInputs(numOfUsersToCreate),
		skipDuplicates: true,
	});
	return count;
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

	await prisma.user.deleteMany();
	await prisma.item.deleteMany();
	await prisma.collectionItem.deleteMany();

	await createUsers(USERS_TO_CREATE);

	for (let i = 0; i < ITEMS_TO_CREATE; i++) {
		await prisma.item.create({
			data: {
				description: generateItemDescription(),
			},
		});
	}

	const users = await prisma.user.findMany();
	const items = await prisma.item.findMany();

	for (const item of items) {
		const numberOfUsersToConnect = faker.number.int({
			min: 0,
			max: users.length,
		});

		const usersToConnect = faker.helpers
			.shuffle(users)
			.slice(0, numberOfUsersToConnect);

		for (const user of usersToConnect) {
			const collectionItemCreateParams: Prisma.CollectionItemCreateArgs = {
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
					url: faker.image.urlLoremFlickr({
						category: "animals",
						height: 320,
						width: 320,
					}),
					height: 320,
					width: 320,
				},
			};

			await prisma.collectionItem.create(collectionItemCreateParams);
		}
	}
}
