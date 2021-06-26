import { Typography } from "@material-ui/core";
import { signIn } from "next-auth/client";
import React from "react";
import { StyledButton } from "./shared";

const NotLoggedInMessage = () => (
  <>
    <Typography variant="h5">
      You must be logged in to view this page.
    </Typography>
    <StyledButton
      size="large"
      fullWidth
      color="secondary"
      variant="contained"
      onClick={() => {
        signIn();
      }}
    >
      Login
    </StyledButton>
  </>
);

export default NotLoggedInMessage;
