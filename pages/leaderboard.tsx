import { Avatar, Box, Grid, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { User } from "models/User";
import Link from "next/link";
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
      <Typography variant="h3" align="center" gutterBottom>
        Leaderboard
      </Typography>
      {users.length > 0 ? (
        users.map((user: User) => (
          <Box
            key={String(user._id)}
            sx={{ cursor: "pointer", width: "100%", mb: 1 }}
          >
            <Link href={`/collections/${user._id}`}>
              <Grid container alignItems="center" sx={{ mb: 1 }} gap={1}>
                <Grid item>
                  <Avatar
                    sx={{ mr: 1, width: 40, height: 40 }}
                    alt={user.name}
                    src={user.image}
                  />
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                  {user.name}
                </Grid>
                <Grid item>
                  <Typography variant="body1" align="center">
                    {user.itemsCollected.length} items
                  </Typography>
                </Grid>
              </Grid>
            </Link>
          </Box>
        ))
      ) : (
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

export default LeaderboardPage;
