import { faker } from "@faker-js/faker";
import { PrismaClient, type Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// TODO: Move to utils package
export const capitalizeEveryWord = (string: string) =>
	string
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const USERS_TO_CREATE = 10;
const ITEMS_TO_CREATE = 20;

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

seed()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});