import { Button, Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import React from "react";

const HomePage = () => {
  const [session] = useSession();

  if (!session)
    return (
      <Container>
        <Typography variant="h5" align="center">
          Welcome. Please login.
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
    <Container>
      <Typography variant="body1">Hello, {session.user.name}.</Typography>
    </Container>
  );
};

export default HomePage;
