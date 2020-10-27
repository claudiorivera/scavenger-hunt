import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledImage from "@components/StyledImage";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import { getSession, useSession } from "next-auth/client";
import Error from "next/error";
import Link from "next/link";
import React from "react";

const ItemFoundByDetails = ({ collectionItem }) => {
  const [session] = useSession();

  if (!session) <SonicWaiting />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h5" gutterBottom>
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
          See Who Else Found It
        </StyledButton>
      </Link>
    </Container>
  );
};

export default ItemFoundByDetails;

export const getServerSideProps = async ({ req, res, params }) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      res.writeHead(302, {
        Location: "/auth/login",
      });
      res.end();
      throw new Error("Not logged in");
    }
    await middleware.apply(req, res);
    const collectionItem = await CollectionItem.findOne()
      .where("user")
      .equals(params.userId)
      .where("item")
      .equals(params.itemId)
      .select("imageUrl user -_id item")
      .populate("user", "_id name")
      .populate("item", "_id itemDescription usersWhoCollected")
      .lean();
    if (!collectionItem) {
      throw new Error(
        "Sorry, something went wrong. Try refreshing or logging out and back in."
      );
    } else {
      return {
        props: {
          collectionItem: JSON.parse(JSON.stringify(collectionItem)),
        },
      };
    }
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in items/id/foundby/userid.js",
        },
      },
    };
  }
};
