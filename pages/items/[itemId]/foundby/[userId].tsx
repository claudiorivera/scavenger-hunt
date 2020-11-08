import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const ItemFoundByDetails = () => {
  const [session] = useSession();
  const router = useRouter();
  const { data: collectionItem } = useSWR(
    `/api/users/${router.query.userId}/items/${router.query.itemId}`,
    fetcher
  );

  if (!session) return <NotLoggedInMessage />;
  if (!collectionItem) return null;

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h5" gutterBottom>
        {collectionItem.user.name} Found {collectionItem.item.itemDescription}!
      </Typography>
      <Image
        height="512px"
        width="512px"
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
