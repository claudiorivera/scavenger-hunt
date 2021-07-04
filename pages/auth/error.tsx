import { Typography } from "@material-ui/core";
import { StyledLink } from "components/shared";
import { useRouter } from "next/router";
import React from "react";

const AuthErrorPage = () => {
  const router = useRouter();

  return (
    <>
      <Typography variant="h5">Sorry, something went wrong.</Typography>
      <StyledLink color="inherit" href="/auth/login">
        Click here to try again
      </StyledLink>
      .<Typography variant="body1">Error Code: {router.query.error}</Typography>
    </>
  );
};

export default AuthErrorPage;
