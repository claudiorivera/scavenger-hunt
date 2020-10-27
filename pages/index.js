import LargeAvatar from "@components/LargeAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import useCurrentUser from "@util/useCurrentUser";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const HomePage = () => {
  const [session] = useSession();
  const { user } = useCurrentUser();
  const router = useRouter();

  if (!session) return <NotLoggedInMessage />;
  if (!user) return <SonicWaiting />;

  return (
    <Container align="center" maxWidth="xs">
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="h5">{user.name}</Typography>
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
    </Container>
  );
};

export default HomePage;
