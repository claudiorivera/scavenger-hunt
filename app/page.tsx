import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import React from "react";

export default async function HomePage() {
  const session = await unstable_getServerSession(nextAuthOptions);

  if (!session)
    return (
      <>
        <div>Not signed in</div>
        <Link href="/api/auth/signin">Sign in</Link>
      </>
    );

  return (
    <>
      <div>Signed in as {session.user.email}</div>
      <Link href="/api/auth/signout">Sign out</Link>
    </>
  );
}
