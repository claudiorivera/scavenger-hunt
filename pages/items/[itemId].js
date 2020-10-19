import { Button, Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const ItemDetailsPage = () => {
  const router = useRouter();
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

  if (router.query.foundBy)
    return (
      <Container align="center">
        <Typography variant="body1">
          ITEM DETAIL PAGE FOR ITEM WITH ID {router.query.itemId} FOUND BY USER
          WITH ID {router.query.foundBy}
        </Typography>
      </Container>
    );

  return (
    <Container align="center">
      <Typography variant="body1">
        ITEM DETAIL PAGE FOR ITEM WITH ID {router.query.itemId}
      </Typography>
    </Container>
  );
};

export default ItemDetailsPage;
