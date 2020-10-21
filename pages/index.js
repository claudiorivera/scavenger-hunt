import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import { Avatar, Container, styled, Typography } from "@material-ui/core";
import middleware from "@middleware";
import User from "@models/User";
import { getSession, signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const LargeAvatar = styled(Avatar)({
  width: "5rem",
  height: "5rem",
});

const HomePage = ({ user }) => {
  const [session] = useSession();
  const router = useRouter();

  if (!session || !user) return <NotLoggedInMessage />;

  return (
    <Container align="center" maxWidth="xs">
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="body1">{user.name}</Typography>
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
