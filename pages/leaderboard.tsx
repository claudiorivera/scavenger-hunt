import { Avatar, Grid, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { StyledLink } from "components/shared";
import { User } from "models/User";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

const LeaderboardPage = () => {
  const { data: session } = useSession();
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
                <Avatar
                  style={{ marginRight: "1rem", width: "3rem", height: "3rem" }}
                  alt={user.name}
                  src={user.image}
                />
              </Grid>
              <Grid item style={{ flexGrow: 1 }}>
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
