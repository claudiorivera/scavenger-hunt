import { Visibility } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { showItemAttribution } from "config";
import { User } from "models/User";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "pages/api/auth/[...nextauth]";
import useSWR from "swr";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/sign-in?callbackUrl=/items/${query.itemId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      itemId: query.itemId,
      user: session.user,
    },
  };
};

type ItemDetailsPageProps = {
  itemId: string;
  user: User;
};

const ItemDetailsPage = ({ itemId, user }: ItemDetailsPageProps) => {
  const { data: item } = useSWR(`/api/items/${itemId}`);

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
          sx={{ mb: 2 }}
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
                sx={{ width: 20, height: 20 }}
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
            sx={{ mb: 2 }}
          >
            <Grid item sx={{ cursor: "pointer" }}>
              <Link color="inherit" href={`/collections/${user._id}`}>
                <Avatar
                  sx={{ mr: 2, width: 50, height: 50 }}
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
      {!userIdsWhoCollected.includes(user._id) && (
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
