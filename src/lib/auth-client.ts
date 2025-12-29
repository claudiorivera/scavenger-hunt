import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

export const { signIn, signOut } = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>()],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
