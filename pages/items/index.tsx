import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Box, Container, Typography } from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import { Item } from "@types";
import fetcher from "@util/fetcher";
import useItems from "@util/useItems";
import { useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

const ItemsPage = () => {
  const [session] = useSession();
  const { items } = useItems();
  const { data: collectedItems } = useSWR("/api/items/collected", fetcher);

  if (!session) return <NotLoggedInMessage />;
  if (!items || !collectedItems) return null;

  const collectedItemIds = collectedItems.map((item: Item) => item._id);

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h3">
        All Items
      </Typography>
      {items.map(({ _id, itemDescription }: Item) => (
        <Box key={String(_id)} display="flex" alignItems="center">
          <Link passHref href={`/items/${_id}`}>
            <StyledButton fullWidth variant="contained" color="secondary">
              {itemDescription}
            </StyledButton>
          </Link>
          {collectedItemIds?.includes(_id) ? (
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
