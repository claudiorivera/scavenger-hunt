import SmallAvatar from "@components/SmallAvatar";
import SonicWaiting from "@components/SonicWaiting";
import StyledDivider from "@components/StyledDivider";
import StyledLink from "@components/StyledLink";
import { Box, Container, styled, Typography } from "@material-ui/core";
import middleware from "@middleware";
import User from "@models/User";
import React from "react";

const StyledContainer = styled(Container)({
  padding: ".5rem",
});

const LeaderboardPage = ({ users }) => {
  const [session] = useSession();

  if (!session) return <SonicWaiting />;

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">Leaderboard</Typography>
      <StyledDivider />
      {users.length > 0 ? (
        users.map((user) => (
          <StyledLink key={user._id} href={`/collections/${user._id}`}>
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
          Nobody's found anything, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
    </Container>
  );
};

export default LeaderboardPage;

export const getServerSideProps = async ({ req, res }) => {
  try {
    await middleware.apply(req, res);
    const users = await User.find()
      .select("_id name itemsCollected image name")
      .lean();
    const sortedUsers = users.sort(
      (a, b) => b.itemsCollected.length - a.itemsCollected.length
    );
    return {
      props: {
        users: JSON.parse(JSON.stringify(sortedUsers)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in leaderboard.js",
        },
      },
    };
  }
};
