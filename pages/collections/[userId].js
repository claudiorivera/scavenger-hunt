import LargeAvatar from "@components/LargeAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SmallAvatar from "@components/SmallAvatar";
import StyledButton from "@components/StyledButton";
import StyledLink from "@components/StyledLink";
import { Box, Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import CollectionItem from "@models/CollectionItem";
import User from "@models/User";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";

const CollectPage = ({ user, items }) => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="body1">{user.name}</Typography>
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
                See Theirs
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
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res, params }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const user = await User.findById(params.userId)
      .select("_id image name")
      .lean();
    const items = await CollectionItem.where("user")
      .equals(params.userId)
      .select("thumbnailUrl item")
      .populate("item", "itemDescription")
      .lean();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } else
    return {
      props: {
        user: null,
      },
    };
};
