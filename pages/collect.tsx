import { Collect, NotLoggedInMessage } from "components";
import { CollectProvider } from "contexts/CollectContext";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

const CollectPage = () => {
  const { data: session } = useSession();
  const { data: uncollectedItems } = useSWR("/api/items/uncollected");

  if (!session) return <NotLoggedInMessage />;
  if (!uncollectedItems) return null;

  return (
    <CollectProvider>
      <Collect />
    </CollectProvider>
  );
};

export default CollectPage;
