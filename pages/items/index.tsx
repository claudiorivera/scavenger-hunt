import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useItems } from "hooks";
import { Item } from "models/Item";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import React from "react";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?callbackUrl=/items",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const ItemsPage = () => {
  const { items } = useItems();
  const { data: collectedItems } = useSWR("/api/items/collected");

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
