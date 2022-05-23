import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { useItems } from "hooks";
import { Item } from "models/Item";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

const ItemsPage = () => {
  const { data: session } = useSession();
  const { items } = useItems();
  const { data: collectedItems } = useSWR("/api/items/collected");

  if (!session) return <NotLoggedInMessage />;
  if (!items || !collectedItems) return null;

  const collectedItemIds = collectedItems.map((item: Item) => item._id);

  return (
    <>
      <Typography variant="h3" align="center" gutterBottom>
        All Items
      </Typography>
      {items.map(({ _id, itemDescription }: Item) => (
        <Grid
          gap={1}
          container
          key={String(_id)}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item sx={{ flexGrow: 1, mb: 2 }}>
            <Link href={`/items/${_id}`}>
              <Button fullWidth variant="contained" color="secondary">
                {itemDescription}
              </Button>
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
