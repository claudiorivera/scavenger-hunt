import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

import { capitalizeEveryWord } from "@claudiorivera/shared";

export * from "@prisma/client";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
	const ITEMS_TO_CREATE = 20;

	await prisma.item.deleteMany();

	for (let i = 0; i < ITEMS_TO_CREATE; i++) {
		await prisma.item.create({
			data: {
				description: generateItemDescription(),
			},
		});
	}
}
