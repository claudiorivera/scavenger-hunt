import { Box, Button, Typography } from "@mui/material";
import { User } from "models/User";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import React from "react";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/sign-in?callbackUrl=/items/${query.itemId}/foundby/${query.userId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: query.userId,
      itemId: query.itemId,
      user: session.user,
    },
  };
};

type ItemFoundByDetailsProps = {
  userId: string;
  itemId: string;
  user: User;
};
const ItemFoundByDetails = ({
  userId,
  itemId,
  user,
}: ItemFoundByDetailsProps) => {
  const { data: collectionItem } = useSWR(
    `/api/users/${userId}/items/${itemId}`
  );

  if (!collectionItem) return null;

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        {collectionItem.user.name ?? collectionItem.user.email} Found{" "}
        {collectionItem.item.itemDescription}!
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Image
          height="512px"
          width="512px"
          src={collectionItem.imageUrl}
          alt={collectionItem.item.itemDescription}
        />
      </Box>
      {!collectionItem.item.usersWhoCollected.includes(user._id) && (
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
