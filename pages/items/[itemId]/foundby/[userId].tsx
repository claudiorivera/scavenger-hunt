import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import StyledImage from "@components/StyledImage";
import { Container, Typography } from "@material-ui/core";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const ItemFoundByDetails = () => {
  const [session] = useSession();

  const router = useRouter();
  const { data: collectionItem } = useSWR(
    `/api/collections?userId=${router.query.userId}&itemId=${router.query.itemId}`,
    fetcher
  );

  if (!session) return <NotLoggedInMessage />;
  if (!collectionItem) return null;

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h5" gutterBottom>
        {collectionItem.user.name} Found {collectionItem.item.itemDescription}!
      </Typography>
      <StyledImage
        src={collectionItem.imageUrl}
        alt={collectionItem.item.itemDescription}
      />
      {!collectionItem.item.usersWhoCollected.includes(session.user.id) && (
        <Link href={`/collect?itemId=${collectionItem.item._id}`}>
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
      <Link href={`/items/${collectionItem.item._id}`}>
        <StyledButton fullWidth variant="contained" color="secondary">
          See Who Found This
        </StyledButton>
      </Link>
    </Container>
  );
};

export default ItemFoundByDetails;
