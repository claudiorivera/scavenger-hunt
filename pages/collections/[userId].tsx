import { Avatar, Grid, Tooltip, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { StyledLink } from "components/shared";
import { Item } from "models/Item";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const CollectionsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: user } = useSWR(`/api/users/${router.query.userId}`);
  const { data: items } = useSWR(
    `/api/users/${router.query.userId}/collection`
  );

  if (!session) return <NotLoggedInMessage />;
  if (!user || !items) return null;

  return (
    <>
      <Avatar
        style={{ width: "5rem", height: "5rem" }}
        alt={user.name}
        src={user.image}
      />
      <Typography variant="h3">{user.name}</Typography>
      <Typography variant="h5" gutterBottom>
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
        <Typography variant="h5">
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
