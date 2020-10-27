import SmallAvatar from "@components/SmallAvatar";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledDivider from "@components/StyledDivider";
import StyledLink from "@components/StyledLink";
import TinyAvatar from "@components/TinyAvatar";
import { showItemAttribution } from "@config";
import { Box, Container, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import middleware from "@middleware";
import Item from "@models/Item";
import { useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";

const ItemDetailsPage = ({ item, userIdsWhoCollected }) => {
  const [session] = useSession();

  if (!session) return <SonicWaiting />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">{item.itemDescription}</Typography>
      {showItemAttribution && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginBottom="2rem"
        >
          Added by:&nbsp;&nbsp;
          <StyledLink
            style={{ display: "flex", alignItems: "center" }}
            href={`/collections/${item.addedBy._id}`}
          >
            <TinyAvatar alt={item.addedBy.name} src={item.addedBy.image} />
            &nbsp;{item.addedBy.name}
          </StyledLink>
        </Box>
      )}
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
                <Visibility />
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
      {!userIdsWhoCollected.includes(session.user.id) && (
        <Link href={`/collect?itemId=${item._id}`}>
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
    </Container>
  );
};

export default ItemDetailsPage;

export const getServerSideProps = async ({ req, res, params }) => {
  try {
    await middleware.apply(req, res);
    const item = await Item.findById(params.itemId)
      .select("-__v")
      .populate("usersWhoCollected", "_id image name")
      .populate("addedBy", "_id image name")
      .lean();
    const userIdsWhoCollected = item.usersWhoCollected.map((user) => user._id);
    return {
      props: {
        item: JSON.parse(JSON.stringify(item)),
        userIdsWhoCollected: JSON.parse(JSON.stringify(userIdsWhoCollected)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in items/id/index.js",
        },
      },
    };
  }
};
