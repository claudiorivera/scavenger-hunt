import { Avatar, Grid, Typography } from "@material-ui/core";
import { CollectedItem, User } from "@prisma/client";
import useSWR from "swr";

import { StyledLink } from "~components";

type PopulatedUser = User & {
  collectedItems: CollectedItem[];
};

const LeaderboardPage = () => {
  const { data: users, error } = useSWR<PopulatedUser[]>("/api/users");

  if (!users && !error) return null;
  if (!users) return <Typography variant="h5">No users found</Typography>;

  return (
    <>
      <Typography variant="h3" align="center" gutterBottom>
        Leaderboard
      </Typography>
      {users.map((user) => (
        <StyledLink
          color="inherit"
          key={user.id}
          href={`/users/${user.id}/collection`}
          style={{ width: "100%" }}
        >
          <Grid container alignItems="center" style={{ marginBottom: "1rem" }}>
            <Grid item>
              <Avatar
                style={{ marginRight: "1rem", width: "3rem", height: "3rem" }}
                alt={user.name!}
                src={user.image!}
              />
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              {user.name}
            </Grid>
            <Grid item>
              <Typography variant="body1" align="center">
                {user.collectedItems.length} item
                {user.collectedItems.length === 1 ? "" : "s"}
              </Typography>
            </Grid>
          </Grid>
        </StyledLink>
      ))}
      {!users.length && (
        <Typography variant="h5" align="center">
          Nobody&apos;s found anything, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
    </>
  );
};

LeaderboardPage.requireAuth = true;

export default LeaderboardPage;
