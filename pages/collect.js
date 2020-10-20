import { Button, Container, styled, Typography } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, signIn, useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const StyledButton = styled(Button)({
  margin: ".5rem .25rem",
});

const CollectPage = ({ items }) => {
  const [session] = useSession();
  const [item, setItem] = useState(items[0]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const router = useRouter();

  // Adapted from https://medium.com/swlh/simple-react-app-with-context-and-functional-components-a374b7fb66b5
  useEffect(() => {
    setItem({ ...items[currentItemIndex] });
  }, [currentItemIndex]);

  const getNextItem = () => {
    let index = currentItemIndex;
    index === items.length - 1 ? (index = 0) : index++;
    setCurrentItemIndex(index);
  };

  if (!session)
    return (
      <Container>
        <Typography variant="h5" align="center">
          You must be logged in to view this page.
        </Typography>
        <Button
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={signIn}
        >
          Login
        </Button>
      </Container>
    );

  return items.length ? (
    <Container align="center">
      <Typography variant="h1">Find</Typography>
      <Typography variant="h2">{item.itemDescription}</Typography>
      <Button
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          getNextItem();
        }}
      >
        Skip
      </Button>
    </Container>
  ) : (
    <Container align="center">
      <Typography variant="h1">You Found All The Items!</Typography>
      <Container>
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
      </Container>
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const items = await Item.find().lean();
    // TODO: Refactor this so that it's not O(n^2)
    // Once CollectionItems are implemented, it will be a faster lookup
    const itemsNotFoundByThisUser = items.filter(
      (item) =>
        item.usersWithItemCollected.filter(
          (user) => user._id.toString() === session.user.id
        ).length === 0
    );
    return {
      props: {
        items: JSON.parse(JSON.stringify(itemsNotFoundByThisUser)),
      },
    };
  } else
    return {
      props: {
        items: [],
      },
    };
};
