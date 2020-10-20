import { Button, Container, Typography } from "@material-ui/core";
import { getSession, signIn, useSession } from "next-auth/client";
import React from "react";
import middleware from "../middleware";
import Item from "../models/Item";

const CollectPage = ({ items }) => {
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
      <Typography variant="h3">Find...</Typography>
      {items &&
        items.map((item) => (
          <Typography key={item._id} variant="body1">
            {item.itemDescription}
          </Typography>
        ))}
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const items = await Item.find().lean();
    return {
      props: {
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } else
    return {
      props: {
        items: null,
      },
    };
};
