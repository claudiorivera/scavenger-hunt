import { Button, Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import React from "react";

const CollectionsPage = () => {
  const [session] = useSession();

  if (!session)
    return (
      <Container>
        <Typography variant="h5" align="center">
          You must be logged in to view this page.
        </Typography>
        <Button
          type="submit"
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={signIn}
        >
          Login
        </Button>
      </Container>
    );

  return (
    <Container align="center">
      <Typography variant="body1">COLLECTIONS PAGE GOES HERE</Typography>
    </Container>
  );
};

export default CollectionsPage;
