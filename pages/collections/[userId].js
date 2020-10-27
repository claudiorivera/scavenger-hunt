import LargeAvatar from "@components/LargeAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SmallAvatar from "@components/SmallAvatar";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledLink from "@components/StyledLink";
import { Box, Container, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const CollectionsPage = () => {
  const [session] = useSession();
  const router = useRouter();
  const { data: user } = useSWR(`/api/user/${router.query.userId}`, fetcher);
  const { data: items } = useSWR(
    `/api/collections?userId=${router.query.userId}`,
    fetcher
  );

  if (!session) return <NotLoggedInMessage />;
  if (!user || !items) return <SonicWaiting />;

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

export default CollectionsPage;
