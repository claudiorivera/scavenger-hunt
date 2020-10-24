import StyledButton from "@components/StyledButton";
import { Box, Container, Typography } from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession } from "next-auth/client";
import Link from "next/link";
import React from "react";

const ItemsPage = ({ items, foundItemIds }) => {
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
  try {
    const session = await getSession({ req });
    if (!session) {
      res.writeHead(302, {
        Location: "/auth/login",
      });
      res.end();
      throw new Error("Not logged in");
    }
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
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in items/index.js.js",
        },
      },
    };
  }
};
