import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SmallAvatar from "@components/SmallAvatar";
import StyledButton from "@components/StyledButton";
import StyledDivider from "@components/StyledDivider";
import StyledLink from "@components/StyledLink";
import TinyAvatar from "@components/TinyAvatar";
import { showItemAttribution } from "@config";
import { Box, Container, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { User } from "@types";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const ItemDetailsPage = () => {
  const [session] = useSession();
  const router = useRouter();
  const { data: item } = useSWR(`/api/items/${router.query.itemId}`, fetcher);

  if (!session) return <NotLoggedInMessage />;
  if (!item) return null;

  const userIdsWhoCollected = item.usersWhoCollected.map(
    (user: User) => user._id
  );

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h3">
        {item.itemDescription}
      </Typography>
      {showItemAttribution && item.addedBy && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginBottom="2rem"
        >
          Added by:&nbsp;&nbsp;
          <StyledLink
            color="inherit"
            style={{ display: "flex", alignItems: "center" }}
            href={`/collections/${item.addedBy._id}`}
          >
            <TinyAvatar alt={item.addedBy.name} src={item.addedBy.image} />
            &nbsp;{item.addedBy.name}
          </StyledLink>
        </Box>
      )}
      <Typography align="center" variant="h5" gutterBottom>
        Collected by:
      </Typography>
      {item.usersWhoCollected.length > 0 ? (
        item.usersWhoCollected.map((user: User) => (
          <Box key={String(user._id)} display="flex" alignItems="center">
            <Box flexGrow="1">
              <StyledLink color="inherit" href={`/collections/${user._id}`}>
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
            <Link passHref href={`/items/${item._id}/foundby/${user._id}`}>
              <StyledButton variant="contained" color="secondary">
                <Visibility />
              </StyledButton>
            </Link>
          </Box>
        ))
      ) : (
        <Typography align="center" variant="h5">
          Nobody, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
      <StyledDivider />
      {!userIdsWhoCollected.includes(session.user.id) && (
        <Link passHref href={`/collect?itemId=${item._id}`}>
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
    </Container>
  );
};

export default ItemDetailsPage;
