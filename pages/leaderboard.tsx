import { Grid, Typography } from "@material-ui/core";
import { NotLoggedInMessage } from "components";
import { SmallAvatar, StyledLink } from "components/shared";
import { User } from "models/User";
import { useSession } from "next-auth/client";
import React from "react";
import useSWR from "swr";

const LeaderboardPage = () => {
  const [session] = useSession();
  const { data: users } = useSWR("/api/users");

  if (!session) return <NotLoggedInMessage />;
  if (!users) return null;

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Leaderboard
      </Typography>
      {users.length > 0 ? (
        users.map((user: User) => (
          <StyledLink
            color="inherit"
            key={String(user._id)}
            href={`/collections/${user._id}`}
            style={{ width: "100%" }}
          >
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: "1rem" }}
            >
              <Grid item>
                <SmallAvatar
                  style={{ marginRight: "1rem" }}
                  alt={user.name}
                  src={user.image}
                />
              </Grid>
              <Grid item xs={8}>
                {user.name}
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  {user.itemsCollected.length} items
                </Typography>
              </Grid>
            </Grid>
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
    </>
  );
};

export default LeaderboardPage;
