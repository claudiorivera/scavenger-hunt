import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import StyledImage from "@components/StyledImage";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";

const ItemFoundByDetails = ({ collectionItem }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h5" gutterBottom>
        {collectionItem.user.name} found {collectionItem.item.itemDescription}!
      </Typography>
      <StyledImage
        src={collectionItem.imageUrl}
        alt={collectionItem.item.itemDescription}
      />
      <Link href={`/collect/${collectionItem.item._id}`}>
        <StyledButton fullWidth variant="contained" color="secondary">
          Found It?
        </StyledButton>
      </Link>
      <Link href={`/items/${collectionItem.item._id}`}>
        <StyledButton fullWidth variant="contained" color="secondary">
          See Who Else Found It
        </StyledButton>
      </Link>
    </Container>
  );
};

export default ItemFoundByDetails;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const collectionItem = await CollectionItem.findOne()
      .where("user")
      .equals(params.userId)
      .where("item")
      .equals(params.itemId)
      .select("imageUrl user -_id item")
      .populate("user", "_id name")
      .populate("item", "_id itemDescription")
      .lean();
    return {
      props: {
        collectionItem: JSON.parse(JSON.stringify(collectionItem)),
      },
    };
  } else
    return {
      props: {
        collectionItem: [],
      },
    };
};
