import { auth } from "@claudiorivera/auth";
import { redirect } from "next/navigation";
import { LeaderBoard } from "~/app/leaderboard/leaderboard";

export default async function LeaderboardPage() {
	const session = await auth();

	if (!session) return redirect("/api/auth/signin");

	return <LeaderBoard />;
}
