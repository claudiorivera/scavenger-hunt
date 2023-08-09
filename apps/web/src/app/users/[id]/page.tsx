import { User } from "~/app/users/[id]/user";

export default function UserPage({ params }: { params: { id: string } }) {
	return <User id={params.id} />;
}
