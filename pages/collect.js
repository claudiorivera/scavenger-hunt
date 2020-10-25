import Collect from "@components/Collect";
import CollectSuccess from "@components/CollectSuccess";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import useUncollectedItems from "@util/useUncollectedItems";
import { CollectProvider } from "context/Collect";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

const CollectPage = () => {
  const { uncollectedItems } = useUncollectedItems();
  const [session] = useSession();
  const router = useRouter();

  if (!session) return <NotLoggedInMessage />;
  if (!uncollectedItems) return <SonicWaiting />;

  return (
    <Container maxWidth="xs" align="center">
      {uncollectedItems.length ? (
        <CollectProvider initialData={uncollectedItems}>
          <Collect />
          <CollectSuccess />
        </CollectProvider>
      ) : (
        <Fragment>
          <Typography variant="h3">
            You Found All The Items!&nbsp;
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
