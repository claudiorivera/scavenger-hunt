import { Avatar, Grid, Typography } from "@material-ui/core";
import { NotLoggedInMessage } from "components";
import { StyledButton } from "components/shared";
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
    <Grid container direction="column" alignItems="center">
      <Avatar
        alt={user.name}
        src={user.image}
        style={{ width: "5rem", height: "5rem" }}
      />
      <Typography variant="h5" align="center" gutterBottom>
        {user.name}
      </Typography>

      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/collect");
        }}
      >
        Collect Items
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/leaderboard");
        }}
      >
        Leaderboard
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${user._id}`);
        }}
      >
        My Collection
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/profile");
        }}
      >
        My Profile
      </StyledButton>
    </Grid>
  );
};

export default HomePage;
