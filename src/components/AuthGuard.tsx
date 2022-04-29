import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

import { useUser } from "~contexts";

type AuthGuardProps = {
  children: ReactNode;
};
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { user, error } = useUser();

  const isLoading = !user && !error;

  useEffect(() => {
    if (!isLoading && !user) router.push("/sign-in");
  }, [isLoading, router, user]);

  if (user) {
    return <>{children}</>;
  }

  return <CircularProgress />;
};
