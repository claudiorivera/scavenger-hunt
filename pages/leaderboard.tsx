import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SmallAvatar from "@components/SmallAvatar";
import StyledDivider from "@components/StyledDivider";
import StyledLink from "@components/StyledLink";
import { Box, Container, styled, Typography } from "@material-ui/core";
import { User } from "@types";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import React from "react";
import useSWR from "swr";

const StyledContainer = styled(Container)({
  padding: ".5rem",
});

const LeaderboardPage = () => {
  const [session] = useSession();
  const { data: users } = useSWR("/api/users", fetcher);

  if (!session) return <NotLoggedInMessage />;
  if (!users) return null;

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h3">
        Leaderboard
      </Typography>
      <StyledDivider />
      {users.length > 0 ? (
        users.map((user: User) => (
          <StyledLink
            color="inherit"
            key={String(user._id)}
            href={`/collections/${user._id}`}
          >
            <StyledContainer>
              <Box display="flex" alignItems="center">
                <Box flexGrow="2">
                  <Box flexGrow="1" display="flex" alignItems="center">
                    <SmallAvatar
                      style={{ marginRight: "1rem" }}
                      alt={user.name}
                      src={user.image}
                    />
                    {user.name}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body1">
                    {user.itemsCollected.length} items
                  </Typography>
                </Box>
              </Box>
            </StyledContainer>
          </StyledLink>
        ))
      ) : (
        <Typography variant="h5">
          Nobody&apos;s found anything, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
    </Container>
  );
};

export default LeaderboardPage;
