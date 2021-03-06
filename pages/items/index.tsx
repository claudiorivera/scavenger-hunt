import { Grid, Typography } from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import { NotLoggedInMessage } from "components";
import { StyledButton } from "components/shared";
import { useItems } from "hooks";
import { Item } from "models/Item";
import { useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

const ItemsPage = () => {
  const [session] = useSession();
  const { items } = useItems();
  const { data: collectedItems } = useSWR("/api/items/collected");

  if (!session) return <NotLoggedInMessage />;
  if (!items || !collectedItems) return null;

  const collectedItemIds = collectedItems.map((item: Item) => item._id);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        All Items
      </Typography>
      {items.map(({ _id, itemDescription }: Item) => (
        <Grid
          container
          key={String(_id)}
          justify="space-between"
          alignItems="center"
        >
          <Grid item style={{ flexGrow: 1 }}>
            <Link passHref href={`/items/${_id}`}>
              <StyledButton fullWidth variant="contained" color="secondary">
                {itemDescription}
              </StyledButton>
            </Link>
          </Grid>
          <Grid item>
            {collectedItemIds?.includes(_id) ? (
              <CheckCircle color="secondary" />
            ) : (
              <RadioButtonUnchecked color="secondary" />
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default ItemsPage;
