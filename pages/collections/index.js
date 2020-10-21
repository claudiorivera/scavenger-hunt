import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import React from "react";

const CollectionsPage = () => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="body1">COLLECTIONS PAGE GOES HERE</Typography>
    </Container>
  );
};

export default CollectionsPage;
