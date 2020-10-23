import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Box, Container, Typography } from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";

const ItemsPage = ({ items, foundItemIds }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">All Items</Typography>
      {items &&
        items.map(({ _id, itemDescription }) => (
          <Box key={_id} display="flex" alignItems="center">
            <Link href={`/items/${_id}`}>
              <StyledButton fullWidth variant="contained" color="secondary">
                {itemDescription}
              </StyledButton>
            </Link>
            {foundItemIds.includes(_id) ? (
              <CheckCircle color="secondary" />
            ) : (
              <RadioButtonUnchecked color="secondary" />
            )}
          </Box>
        ))}
    </Container>
  );
};

export default ItemsPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const items = await Item.find().select("-__v -addedBy").lean();
    const foundItems = await Item.where("usersWhoCollected")
      .equals(session.user.id)
      .select("_id");
    const foundItemIds = foundItems.map((item) => item._id);
    return {
      props: {
        items: JSON.parse(JSON.stringify(items)),
        foundItemIds: JSON.parse(JSON.stringify(foundItemIds)),
      },
    };
  } else
    return {
      props: {
        items: [],
        foundItemIds: [],
      },
    };
};
