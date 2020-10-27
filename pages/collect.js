import Collect from "@components/Collect";
import DebugCollectPage from "@components/DebugCollectPage";
import SonicWaiting from "@components/SonicWaiting";
import { CollectProvider } from "@context/Collect";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, useSession } from "next-auth/client";
import React from "react";

const CollectPage = ({ initialUncollectedItems }) => {
  const [session] = useSession();
  const showDebug = false;

  if (!session) return <SonicWaiting />;

  return (
    <CollectProvider initialUncollectedItems={initialUncollectedItems}>
      {showDebug && <DebugCollectPage />}
      <Collect />
    </CollectProvider>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res }) => {
  try {
    await middleware.apply(req, res);
    const session = await getSession({ req });
    if (!session)
      throw new Error(
        "Sorry, something went wrong. Try refreshing or logging out and back in."
      );
    const initialUncollectedItems = await Item.where("usersWhoCollected")
      .ne(session.user.id)
      .select("-addedBy -__v -usersWhoCollected")
      .lean();
    if (!initialUncollectedItems)
      throw new Error(
        "Sorry, something went wrong. Try refreshing or logging out and back in."
      );
    return {
      props: {
        initialUncollectedItems: JSON.parse(
          JSON.stringify(initialUncollectedItems)
        ),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in leaderboard.js",
        },
      },
    };
  }
};
