import { Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { StyledButton } from "components/shared";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const ItemFoundByDetails = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: collectionItem } = useSWR(
    `/api/users/${router.query.userId}/items/${router.query.itemId}`
  );

  if (!session) return <NotLoggedInMessage />;
  if (!collectionItem) return null;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {collectionItem.user.name} Found {collectionItem.item.itemDescription}!
      </Typography>
      <Image
        height="512px"
        width="512px"
        src={collectionItem.imageUrl}
        alt={collectionItem.item.itemDescription}
      />
      {!collectionItem.item.usersWhoCollected.includes(session.user.id) && (
        <Link passHref href={`/collect?itemId=${collectionItem.item._id}`}>
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
      <Link passHref href={`/items/${collectionItem.item._id}`}>
        <StyledButton fullWidth variant="contained" color="secondary">
          See Who Found This
        </StyledButton>
      </Link>
    </>
  );
};

export default ItemFoundByDetails;
