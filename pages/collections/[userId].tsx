import { Avatar, Grid, Link, Tooltip, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { Item } from "models/Item";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      userId: context.query.userId,
    },
  };
};

type CollectionsPageProps = {
  userId: string;
};
const CollectionsPage = ({ userId }: CollectionsPageProps) => {
  const { data: session } = useSession();
  const { data: user } = useSWR(`/api/users/${userId}`);
  const { data: items } = useSWR(`/api/users/${userId}/collection`);

  if (!session) return <NotLoggedInMessage />;
  if (!user || !items) return null;

  return (
    <>
      <Avatar
        sx={{ width: 100, height: 100 }}
        alt={user.name}
        src={user.image}
      />
      <Typography variant="h3" align="center">
        {user.name}
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
