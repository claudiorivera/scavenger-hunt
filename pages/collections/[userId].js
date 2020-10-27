import LargeAvatar from "@components/LargeAvatar";
import SmallAvatar from "@components/SmallAvatar";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledLink from "@components/StyledLink";
import { Box, Container, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import User from "@models/User";
import { useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";

const CollectPage = ({ user, items }) => {
  const [session] = useSession();

  if (!session) return <SonicWaiting />;

  return (
    <Container align="center" maxWidth="xs">
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="h3">{user.name}</Typography>
      <Typography variant="h5" gutterBottom>
        Found the Following Items:
      </Typography>
      {items.length > 0 ? (
        items.map(({ _id, thumbnailUrl, item }) => (
          <Box key={_id} display="flex" alignItems="center">
            <Box flexGrow="1">
              <Box display="flex" alignItems="center">
                <StyledLink href={`/items/${item._id}/foundby/${user._id}`}>
                  <SmallAvatar
                    style={{ marginRight: "1rem" }}
                    alt={item.itemDescription}
                    src={thumbnailUrl}
                  />
                </StyledLink>
                <StyledLink href={`/items/${item._id}`}>
                  {item.itemDescription}
                </StyledLink>
              </Box>
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
          Nothing, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res, params }) => {
  try {
    await middleware.apply(req, res);
    const user = await User.findById(params.userId)
      .select("_id image name")
      .lean();
    const items = await CollectionItem.where("user")
      .equals(params.userId)
      .select("thumbnailUrl item")
      .populate("item", "itemDescription")
      .lean();
    if (!user || !items)
      throw new Error(
        "Sorry, something went wrong. Try refreshing the page, or logging out and back in."
      );
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in collections/userid.js",
        },
      },
    };
  }
};
