import { Box, Button, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      userId: context.query.userId,
      itemId: context.query.itemId,
    },
  };
};

type ItemFoundByDetailsProps = {
  userId: string;
  itemId: string;
};
const ItemFoundByDetails = ({ userId, itemId }: ItemFoundByDetailsProps) => {
  const { data: session } = useSession();
  const { data: collectionItem } = useSWR(
    `/api/users/${userId}/items/${itemId}`
  );

  if (!session) return <NotLoggedInMessage />;
  if (!collectionItem) return null;

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        {collectionItem.user.name} Found {collectionItem.item.itemDescription}!
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Image
          height="512px"
          width="512px"
          src={collectionItem.imageUrl}
          alt={collectionItem.item.itemDescription}
        />
      </Box>
      {!collectionItem.item.usersWhoCollected.includes(session.user.id) && (
        <Link passHref href={`/collect?itemId=${collectionItem.item._id}`}>
          <Button fullWidth variant="contained" color="secondary">
            Found It?
          </Button>
        </Link>
      )}
      <Link passHref href={`/items/${collectionItem.item._id}`}>
        <Button fullWidth variant="contained" color="secondary">
          See Who Found This
        </Button>
      </Link>
    </>
  );
};

export default ItemFoundByDetails;
