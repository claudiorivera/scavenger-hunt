import { Container, Typography } from "@material-ui/core";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const AuthVerifyRequestPage = () => {
  const [session] = useSession();
  const router = useRouter();

  if (session) router.push("/");
  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="body1">
        Check your email for a login link from notifications@claudiorivera.com.
        Be sure to check your spam folder.
      </Typography>
    </Container>
  );
};

export default AuthVerifyRequestPage;
