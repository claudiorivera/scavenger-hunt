import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const CollectPage = () => {
  const router = useRouter();
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="body1">
        COLLECTION PAGE FOR USER WITH ID: {router.query.userId}
      </Typography>
    </Container>
  );
};

export default CollectPage;
