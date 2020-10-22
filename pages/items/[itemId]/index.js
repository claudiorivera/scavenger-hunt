import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SmallAvatar from "@components/SmallAvatar";
import StyledButton from "@components/StyledButton";
import StyledDivider from "@components/StyledDivider";
import StyledLink from "@components/StyledLink";
import TinyAvatar from "@components/TinyAvatar";
import { Box, Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import Item from "@models/Item";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ItemDetailsPage = ({ item }) => {
  const [session] = useSession();
  const router = useRouter();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">{item.itemDescription}</Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="2rem"
      >
        (<Typography variant="caption">Added by:</Typography>
        <TinyAvatar alt={item.addedBy.name} src={item.addedBy.image} />
        {item.addedBy.name})
      </Box>
      <Typography variant="h5" gutterBottom>
        Collected by:
      </Typography>
      {item.usersWhoCollected.length > 0 ? (
        item.usersWhoCollected.map((user) => (
          <Box key={user._id} display="flex" alignItems="center">
            <Box flexGrow="1">
              <StyledLink href={`/collections/${user._id}`}>
                <Box display="flex" alignItems="center">
                  <SmallAvatar
                    style={{ marginRight: "1rem" }}
                    alt={user.name}
                    src={user.image}
                  />
                  {user.name}
                </Box>
              </StyledLink>
            </Box>
            <Link href={`/items/${item._id}/foundby/${user._id}`}>
              <StyledButton variant="contained" color="secondary">
                View Item
              </StyledButton>
            </Link>
          </Box>
        ))
      ) : (
        <Typography variant="h5">
          Nobody, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
      <StyledDivider />
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collect?itemId=${item._id}`);
        }}
      >
        Got One?
      </StyledButton>
    </Container>
  );
};

export default ItemDetailsPage;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const item = await Item.findById(params.itemId)
      .populate("usersWhoCollected", "_id image name")
      .populate("addedBy", "_id image name")
      .lean();
    return {
      props: {
        item: JSON.parse(JSON.stringify(item)),
      },
    };
  } else
    return {
      props: {
        item: [],
      },
    };
};
