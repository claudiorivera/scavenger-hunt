import { seed } from "@/db/seed";

seed()
	.then(() => {
		process.exit(0);
	})
	.catch(async (e) => {
		console.error(e);
		process.exit(1);
	});
