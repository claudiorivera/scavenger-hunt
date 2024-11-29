import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { seed } from "@claudiorivera/db";

export async function POST() {
	const headersList = await headers();
	const authorization = headersList.get("authorization");

	if (authorization === `Bearer ${process.env.CRON_SECRET}`) {
		await seed();

		return NextResponse.json(
			{ message: "Success" },
			{
				status: 200,
			},
		);
	}

	return NextResponse.json(
		{ message: "Unauthorized" },
		{
			status: 401,
		},
	);
}
