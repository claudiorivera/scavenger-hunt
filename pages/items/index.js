import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@material-ui/icons";

const ItemsPage = ({ items, foundItemIds }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">All Items</Typography>
      {items &&
        items.map(({ _id, itemDescription }) => (
          <Link key={_id} href={`/items/${_id}`}>
            <StyledButton
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={
                foundItemIds.includes(_id) ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )
              }
            >
              {itemDescription}
            </StyledButton>
          </Link>
        ))}
    </Container>
  );
};

export default ItemsPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const items = await Item.find().lean();
    const foundItemIds = await Item.where("usersWithItemCollected")
      .equals(session.user.id)
      .select("_id");
    const foundIds = foundItemIds.map((item) => item._id);
    return {
      props: {
        items: JSON.parse(JSON.stringify(items)),
        foundItemIds: JSON.parse(JSON.stringify(foundIds)),
      },
    };
  } else
    return {
      props: {
        items: [],
      },
    };
};
