import { Avatar, Button, Grid, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { useCurrentUser } from "hooks";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React from "react";

const HomePage = () => {
  const { data: session } = useSession();
  const { user } = useCurrentUser();
  const router = useRouter();

  if (!session) return <NotLoggedInMessage />;
  if (!user) return null;

  return (
    <Grid container direction="column" alignItems="center" gap={2}>
      <Avatar
        alt={user.name}
        src={user.image}
        sx={{ width: 100, height: 100 }}
      />
      <Typography variant="h5" align="center" gutterBottom>
        {user.name}
      </Typography>

      <Button
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/collect");
        }}
      >
        Collect Items
      </Button>
      <Button
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/leaderboard");
        }}
      >
        Leaderboard
      </Button>
      <Button
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${user._id}`);
        }}
      >
        My Collection
      </Button>
      <Button
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/profile");
        }}
      >
        My Profile
      </Button>
    </Grid>
  );
};

export default HomePage;
