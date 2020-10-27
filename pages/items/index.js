import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import { Box, Container, Typography } from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import fetcher from "@util/fetcher";
import useItems from "@util/useItems";
import { useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

const ItemsPage = () => {
  const [session] = useSession();
  const { items } = useItems();
  const { data: collectedItems } = useSWR("/api/items?collected", fetcher);

  if (!session) return <NotLoggedInMessage />;
  if (!items || !collectedItems) return <SonicWaiting />;

  const collectedItemIds = collectedItems.map((item) => item._id);

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">All Items</Typography>
      {items.map(({ _id, itemDescription }) => (
        <Box key={_id} display="flex" alignItems="center">
          <Link href={`/items/${_id}`}>
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
