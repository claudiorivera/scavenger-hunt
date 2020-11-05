import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { signIn } from "next-auth/client";
import React from "react";

const NotLoggedInMessage = () => (
  <Container maxWidth="xs">
    <Typography align="center" variant="h5">
      You must be logged in to view this page.
    </Typography>
    <StyledButton
      size="large"
      fullWidth
      color="secondary"
      variant="contained"
      onClick={signIn}
    >
      Login
    </StyledButton>
  </Container>
);

export default NotLoggedInMessage;
