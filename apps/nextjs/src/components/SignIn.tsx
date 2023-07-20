import Link from "next/link";

export function SignIn() {
	return (
		<div className="flex flex-col">
			<Link href={"/api/auth/signin"} className="btn btn-secondary">
				Sign In
			</Link>
		</div>
	);
}
