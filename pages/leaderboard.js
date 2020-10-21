import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import React from "react";

const LeaderboardPage = () => {
  const [session] = useSession();

  if (!session) return <NotLoggedInMessage />;

  return (
    <Container align="center">
      <Typography variant="body1">LEADERBOARD PAGE GOES HERE</Typography>
    </Container>
  );
};

export default LeaderboardPage;
