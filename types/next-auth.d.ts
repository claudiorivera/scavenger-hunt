import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user: {
      _id: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}
