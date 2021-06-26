import { Typography } from "@material-ui/core";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const AuthVerifyRequestPage = () => {
  const [session] = useSession();
  const router = useRouter();

  if (session) router.push("/");

  return (
    <Typography variant="body1">{`Check your email for a login link from ${process.env.NEXT_PUBLIC_EMAIL_FROM}.
        Be sure to check your spam folder.`}</Typography>
  );
};

export default AuthVerifyRequestPage;
