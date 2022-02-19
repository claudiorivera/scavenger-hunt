import { Avatar, Grid, Tooltip, Typography } from "@material-ui/core";
import { NotLoggedInMessage } from "components";
import { StyledLink } from "components/shared";
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
        style={{ width: "5rem", height: "5rem" }}
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
                <StyledLink href={`/items/${item._id}/foundby/${user._id}`}>
                  <Tooltip
                    title={item.itemDescription}
                    aria-label={item.itemDescription}
                  >
                    <Avatar
                      style={{ margin: ".5rem", width: "3rem", height: "3rem" }}
                      alt={item.itemDescription}
                      src={thumbnailUrl}
                    />
                  </Tooltip>
                </StyledLink>
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
