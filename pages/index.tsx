import { Avatar, Button, Grid, Typography } from "@mui/material";
import UserModel, { User } from "models/User";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import React from "react";
import { dbConnect } from "util/dbConnect";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?callbackUrl=/",
        permanent: false,
      },
    };
  }

  await dbConnect();

  const user = await UserModel.findById(session.user._id).lean().exec();

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
};

type Props = {
  user: User;
};

const HomePage = ({ user }: Props) => {
  const router = useRouter();

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
