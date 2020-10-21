import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const ItemDetailsPage = () => {
  const router = useRouter();
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

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
