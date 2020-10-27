import LargeAvatar from "@components/LargeAvatar";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import middleware from "@middleware";
import User from "@models/User";
import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const HomePage = ({ user }) => {
  const [session] = useSession();
  const router = useRouter();

  if (!session) return <SonicWaiting />;

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

export const getServerSideProps = async ({ req, res }) => {
  try {
    await middleware.apply(req, res);
    const session = await getSession({ req });
    const user = await User.findById(session.user.id)
      .select("_id name image")
      .lean();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in index.js",
        },
      },
    };
  }
};
