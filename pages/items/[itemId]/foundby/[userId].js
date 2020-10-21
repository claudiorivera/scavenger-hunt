import NotLoggedInMessage from "@components/NotLoggedInMessage";
import { Container, Typography } from "@material-ui/core";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const ItemFoundByDetails = () => {
  const router = useRouter();
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="body1">
        ITEM DETAIL PAGE FOR ITEM WITH ID {router.query.itemId} FOUND BY USER
        WITH ID {router.query.userId}
      </Typography>
    </Container>
  );
};

export default ItemFoundByDetails;
