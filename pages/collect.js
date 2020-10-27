import Collect from "@components/Collect";
import DebugCollectPage from "@components/DebugCollectPage";
import { CollectProvider } from "@context/Collect";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession } from "next-auth/client";
import React from "react";

const CollectPage = ({ initialUncollectedItems }) => {
  const showDebug = false;

  return (
    <CollectProvider initialUncollectedItems={initialUncollectedItems}>
      {showDebug && <DebugCollectPage />}
      <Collect />
    </CollectProvider>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const initialUncollectedItems = await Item.where("usersWhoCollected")
      .ne(session.user.id)
      .select("-addedBy -__v -usersWhoCollected")
      .lean();
    if (!initialUncollectedItems) {
      throw new Error(
        "Sorry, something went wrong. Try refreshing or logging out and back in."
      );
    } else {
      return {
        props: {
          initialUncollectedItems: JSON.parse(
            JSON.stringify(initialUncollectedItems)
          ),
        },
      };
    }
  } else
    return {
      props: {
        initialUncollectedItems: [],
      },
    };
};
