import { Container, Typography } from "@material-ui/core";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const AuthVerifyRequestPage = () => {
  const [session] = useSession();
  const router = useRouter();

  if (session) router.push("/");

  return (
    <Container maxWidth="xs">
      <Typography variant="body1" align="center">
        Check your email for a login link from notifications@claudiorivera.com.
        Be sure to check your spam folder.
      </Typography>
    </Container>
  );
};

export default AuthVerifyRequestPage;
