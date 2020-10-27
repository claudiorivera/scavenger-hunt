import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SmallAvatar from "@components/SmallAvatar";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledDivider from "@components/StyledDivider";
import StyledLink from "@components/StyledLink";
import TinyAvatar from "@components/TinyAvatar";
import { showItemAttribution } from "@config";
import { Box, Container, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
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

  const userIdsWhoCollected = item.usersWhoCollected.map((user) => user._id);

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
