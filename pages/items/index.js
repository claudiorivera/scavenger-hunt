import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import React from "react";

const ItemsPage = () => {
  const [session] = useSession();

  if (!session)
    return (
      <Container>
        <Typography variant="h5" align="center">
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

  return (
    <Container align="center">
      <Typography variant="body1">ITEMS PAGE GOES HERE</Typography>
    </Container>
  );
};

export default ItemsPage;
