import Collect from "@components/Collect";
import CollectSuccess from "@components/CollectSuccess";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import { Container } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import { CollectProvider } from "context/Collect";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const CollectPage = ({ items }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <CollectProvider initialItems={items}>
      <Container maxWidth="xs" align="center">
        <Collect />
        <CollectSuccess />
      </Container>
    </CollectProvider>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    if ("itemId" in query) {
      const items = await Item.findById(query.itemId)
        .select("-addedBy -__v")
        .lean();
      return {
        props: {
          items: JSON.parse(JSON.stringify([items])),
        },
      };
    } else {
      const items = await Item.where("usersWhoCollected")
        .ne(session.user.id)
        .select("-addedBy -__v")
        .lean();
      return {
        props: {
          items: JSON.parse(JSON.stringify(items)),
        },
      };
    }
  } else
    return {
      props: {
        items: [],
      },
    };
};
