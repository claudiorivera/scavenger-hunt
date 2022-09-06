import { Avatar, Box, Grid, Typography } from "@mui/material";
import UserModel, { User } from "models/User";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import React from "react";
import dbConnect from "util/dbConnect";

import { nextAuthOptions } from "./api/auth/[...nextauth]";
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?callbackUrl=/leaderboard",
        permanent: false,
      },
    };
  }

  try {
    await dbConnect();

    const users = await UserModel.find()
      .select("_id name itemsCollected image name")
      .lean();

    const sortedUsers = users.sort(
      (a, b) => b.itemsCollected.length - a.itemsCollected.length
    );

    return {
      props: { users: JSON.parse(JSON.stringify(sortedUsers)) },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};

type Props = {
  users: User[];
};

const LeaderboardPage = ({ users }: Props) => {
  return (
    <>
      <Typography variant="h3" align="center" gutterBottom>
        Leaderboard
      </Typography>
      {!!users.length ? (
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
                    alt={user.name ?? user.email}
                    src={user.image}
                  />
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                  {user.name ?? user.email}
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
