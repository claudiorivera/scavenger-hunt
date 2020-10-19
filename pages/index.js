import {
  Avatar,
  Button,
  Container,
  styled,
  Typography,
} from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const LargeAvatar = styled(Avatar)({
  width: "5rem",
  height: "5rem",
});

const StyledButton = styled(Button)({
  margin: ".5rem .25rem",
});

const HomePage = () => {
  const [session] = useSession();
  const router = useRouter();

  if (!session)
    return (
      <Container>
        <Typography variant="h5" align="center">
          Welcome. Please login.
        </Typography>
        <Button
          type="submit"
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={signIn}
        >
          Login
        </Button>
      </Container>
    );

  return (
    <Container align="center">
      <LargeAvatar alt={session.user.name} src={session.user.image} />
      <Typography variant="body1">{session.user.name}</Typography>
      <StyledButton
        type="submit"
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
        type="submit"
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
        type="submit"
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${session.user.id}`);
        }}
      >
        My Collection
      </StyledButton>
    </Container>
  );
};

export default HomePage;
