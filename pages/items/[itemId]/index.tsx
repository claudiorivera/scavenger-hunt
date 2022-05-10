import { Visibility } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { NotLoggedInMessage } from "components";
import { showItemAttribution } from "config";
import { User } from "models/User";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      itemId: context.query.itemId,
    },
  };
};

type ItemDetailsPageProps = {
  itemId: string;
};

const ItemDetailsPage = ({ itemId }: ItemDetailsPageProps) => {
  const { data: session } = useSession();
  const { data: item } = useSWR(`/api/items/${itemId}`);

  if (!session) return <NotLoggedInMessage />;
  if (!item) return null;

  const userIdsWhoCollected = item.usersWhoCollected.map(
    (user: User) => user._id
  );

  return (
    <>
      <Typography variant="h3" align="center">
        {item.itemDescription}
      </Typography>
      {showItemAttribution && item.addedBy && (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{ marginBottom: "1rem" }}
        >
          <Typography variant="caption">Added by:&nbsp;&nbsp;</Typography>
          <Link href={`/collections/${item.addedBy._id}`}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Avatar
                alt={item.addedBy.name}
                src={item.addedBy.image}
                sx={{ width: "1rem", height: "1rem" }}
              />
              <Typography variant="caption">{item.addedBy.name}</Typography>
            </Box>
          </Link>
        </Grid>
      )}
      <Typography variant="h5" align="center" gutterBottom>
        Collected by:
      </Typography>
      {item.usersWhoCollected.length > 0 ? (
        item.usersWhoCollected.map((user: User) => (
          <Grid
            container
            key={String(user._id)}
            alignItems="center"
            sx={{ marginBottom: "1rem" }}
          >
            <Grid item sx={{ cursor: "pointer" }}>
              <Link color="inherit" href={`/collections/${user._id}`}>
                <Avatar
                  sx={{ marginRight: "1rem", width: "3rem", height: "3rem" }}
                  alt={user.name}
                  src={user.image}
                />
              </Link>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              {user.name}
            </Grid>
            <Grid item>
              <Link href={`/items/${item._id}/foundby/${user._id}`}>
                <Button variant="contained" color="secondary">
                  <Visibility />
                </Button>
              </Link>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography variant="h5" align="center">
          Nobody, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
      {!userIdsWhoCollected.includes(session.user.id) && (
        <Link href={`/collect?itemId=${item._id}`}>
          <Button fullWidth variant="contained" color="secondary">
            Found It?
          </Button>
        </Link>
      )}
    </>
  );
};

export default ItemDetailsPage;
