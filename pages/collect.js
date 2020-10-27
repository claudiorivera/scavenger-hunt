import Collect from "@components/Collect";
import DebugCollectPage from "@components/DebugCollectPage";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SonicWaiting from "@components/SonicWaiting";
import { CollectProvider } from "@context/Collect";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import React from "react";
import useSWR from "swr";

const CollectPage = () => {
  const [session] = useSession();
  const { data: uncollectedItems } = useSWR("/api/items?uncollected", fetcher);
  const showDebug = false;

  if (!session) return <NotLoggedInMessage />;
  if (!uncollectedItems) return null;

  return (
    <CollectProvider>
      {showDebug && <DebugCollectPage />}
      <Collect />
    </CollectProvider>
  );
};

export default CollectPage;
