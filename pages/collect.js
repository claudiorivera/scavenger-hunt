import Collect from "@components/Collect";
import CollectSuccess from "@components/CollectSuccess";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import { CollectProvider } from "context/Collect";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

const CollectPage = ({ uncollectedItems, startWithItem }) => {
  const [session] = useSession();
  const router = useRouter();

  if (!session) return <NotLoggedInMessage />;

  return (
    <CollectProvider
      initialUncollectedItems={uncollectedItems}
      startWithItem={startWithItem}
    >
      <Container maxWidth="xs" align="center">
        {uncollectedItems.length > 0 ? (
          <Fragment>
            <Collect />
            <CollectSuccess />
          </Fragment>
        ) : (
          <Fragment>
            <Typography variant="h1">You Found All The Items!</Typography>
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
    </CollectProvider>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res, query }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const uncollectedItems = await Item.where("usersWhoCollected")
      .ne(session.user.id)
      .select("-addedBy -__v -usersWhoCollected")
      .lean();
    const startWithItem = await Item.findById(query.itemId).select(
      "_id itemDescription"
    );
    return {
      props: {
        uncollectedItems: JSON.parse(JSON.stringify(uncollectedItems)),
        startWithItem: JSON.parse(JSON.stringify(startWithItem)),
      },
    };
  } else
    return {
      props: {
        uncollectedItems: [],
      },
    };
};
