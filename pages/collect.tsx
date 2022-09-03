import { Collect } from "components";
import { CollectProvider } from "contexts/CollectContext";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import React from "react";
import useSWR from "swr";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?callbackUrl=/collect",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const CollectPage = () => {
  const { data: uncollectedItems } = useSWR("/api/items/uncollected");

  if (!uncollectedItems) return null;

  return (
    <CollectProvider>
      <Collect />
    </CollectProvider>
  );
};

export default CollectPage;
