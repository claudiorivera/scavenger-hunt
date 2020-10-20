import {
  Avatar,
  Button,
  Container,
  styled,
  Typography,
} from "@material-ui/core";
import middleware from "@middleware";
import User from "@models/User";
import { getSession, signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const LargeAvatar = styled(Avatar)({
  width: "5rem",
  height: "5rem",
});

const StyledButton = styled(Button)({
  margin: ".5rem .25rem",
});

const HomePage = ({ user }) => {
  const [session] = useSession();
  const router = useRouter();

  if (!session || !user)
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
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="body1">{user.name}</Typography>
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
          router.push(`/collections/${user._id}`);
        }}
      >
        My Collection
      </StyledButton>
    </Container>
  );
};

export default HomePage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const user = await User.findById(session.user.id).lean();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } else
    return {
      props: {
        user: null,
      },
    };
};
