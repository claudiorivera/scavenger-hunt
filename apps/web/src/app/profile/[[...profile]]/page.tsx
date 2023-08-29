import { UserProfile } from "@clerk/nextjs";

import Container from "~/components/Container";

export default function ProfilePage() {
	return (
		<Container>
			<UserProfile path="/profile" routing="path" appearance={{}} />
		</Container>
	);
}
