import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    isAdmin: boolean;
  }
  interface Callbacks {
    session?(
      session: Session,
      sessionToken: GenericObject
    ): Promise<GenericObject>;
  }
}
