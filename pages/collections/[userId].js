import LargeAvatar from "@components/LargeAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import User from "@models/User";
import { getSession, useSession } from "next-auth/client";
import React from "react";

const CollectPage = ({ user, items }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="body1">{user.name}</Typography>
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const user = await User.findById(params.userId)
      .select("_id image name")
      .lean();
    const items = await CollectionItem.where("user")
      .equals(params.userId)
      .select("_id thumbnailUrl item")
      .populate("item", "itemDescription -_id")
      .lean();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } else
    return {
      props: {
        user: null,
      },
    };
};
