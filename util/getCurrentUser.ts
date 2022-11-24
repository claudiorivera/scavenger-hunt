import { getSession } from "./getSession";

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user;
}
