import Collect from "@components/Collect";
import DebugCollectPage from "@components/DebugCollectPage";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import { CollectProvider } from "@context/Collect";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, useSession } from "next-auth/client";
import React from "react";

const CollectPage = ({ initialUncollectedItems }) => {
  const showDebug = process.env.NODE_ENV !== "production";
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

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
    return {
      props: {
        initialUncollectedItems: JSON.parse(
          JSON.stringify(initialUncollectedItems)
        ),
      },
    };
  } else
    return {
      props: {
        initialUncollectedItems: [],
      },
    };
};
