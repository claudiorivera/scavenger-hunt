import Collect from "@components/Collect";
import CollectSuccess from "@components/CollectSuccess";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import useUncollectedItems from "@util/useUncollectedItems";
import { CollectProvider } from "context/Collect";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

const CollectPage = ({ startWithItem }) => {
  const { uncollectedItems } = useUncollectedItems();
  const [session] = useSession();
  const router = useRouter();

  if (!uncollectedItems) return <SonicWaiting />;

  return (
    <Container maxWidth="xs">
      {uncollectedItems.length ? (
        <CollectProvider
          startWithItem={startWithItem}
          initialData={uncollectedItems}
        >
          <Collect />
          <CollectSuccess />
        </CollectProvider>
      ) : (
        <Fragment>
          <Typography variant="h3">
            You Found All The Items!
            <span role="img" aria-label="celebrate emoji">
              🎉
            </span>
          </Typography>
          <StyledButton
            size="large"
            fullWidth
            color="secondary"
            variant="contained"
            onClick={() => {
              router.push(`/collections/${session.user.id}`);
            }}
          >
            My Collection
          </StyledButton>
        </Fragment>
      )}
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res, query }) => {
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
    const startWithItem = await Item.findById(query.itemId).select("_id");
    return {
      props: {
        startWithItem: JSON.parse(JSON.stringify(startWithItem)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message: error.message || "Sorry, something went wrong in collect.js",
        },
      },
    };
  }
};
