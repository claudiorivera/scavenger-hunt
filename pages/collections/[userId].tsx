import { Avatar, Grid, Link, Tooltip, Typography } from "@mui/material";
import { Item } from "models/Item";
import UserModel, { User } from "models/User";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import React from "react";
import useSWR from "swr";
import dbConnect from "util/dbConnect";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/sign-in?callbackUrl=/collections/${query.userId}`,
        permanent: false,
      },
    };
  }

  try {
    await dbConnect();

    const user = await UserModel.findById(query.userId);

    return {
      props: {
        userId: query.userId,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};

type CollectionsPageProps = {
  userId: string;
  user: User;
};
const CollectionsPage = ({ userId, user }: CollectionsPageProps) => {
  const { data: items } = useSWR(`/api/users/${userId}/collection`);

  if (!items) return null;

  return (
    <>
      <Avatar
        sx={{ width: 100, height: 100 }}
        alt={user.name ?? user.email}
        src={user.image}
      />
      <Typography variant="h3" align="center">
        {user.name ?? user.email}
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Found the Following Items:
      </Typography>
      {items.length > 0 ? (
        <Grid container justifyContent="center">
          {items.map(
            ({
              _id,
              thumbnailUrl,
              item,
            }: {
              _id: number;
              thumbnailUrl: string;
              item: Item;
            }) => (
              <Grid item key={_id}>
                <Link href={`/items/${item._id}/foundby/${user._id}`}>
                  <Tooltip
                    title={item.itemDescription}
                    aria-label={item.itemDescription}
                  >
                    <Avatar
                      sx={{ m: 1, width: 50, height: 50 }}
                      alt={item.itemDescription}
                      src={thumbnailUrl}
                    />
                  </Tooltip>
                </Link>
              </Grid>
            )
          )}
        </Grid>
      ) : (
        <Typography variant="h5" align="center">
          Nothing, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
    </>
  );
};

export default CollectionsPage;
