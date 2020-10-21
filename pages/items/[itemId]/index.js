import NotLoggedInMessage from "@components/NotLoggedInMessage";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, useSession } from "next-auth/client";
import React from "react";

const ItemDetailsPage = ({ item }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center">
      <Typography variant="h3">{item.itemDescription}</Typography>
      <Typography variant="body1">was found by the following users:</Typography>
      {/* TODO: List users here with links to their collection item page for this item */}
    </Container>
  );
};

export default ItemDetailsPage;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const item = await Item.findById(params.itemId).lean();
    // TODO: fetch the collection items to display next to user's names and link to that collection item page
    return {
      props: {
        item: JSON.parse(JSON.stringify(item)),
      },
    };
  } else
    return {
      props: {
        item: [],
      },
    };
};
