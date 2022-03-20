import { Avatar, Grid, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { NotLoggedInMessage } from "components";
import { StyledButton, StyledLink } from "components/shared";
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
          style={{ marginBottom: "1rem" }}
        >
          <Typography variant="caption">Added by:&nbsp;&nbsp;</Typography>
          <StyledLink
            color="inherit"
            style={{ display: "flex", alignItems: "center" }}
            href={`/collections/${item.addedBy._id}`}
          >
            <Avatar
              alt={item.addedBy.name}
              src={item.addedBy.image}
              style={{ width: "1rem", height: "1rem" }}
            />
            &nbsp;{item.addedBy.name}
          </StyledLink>
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
            style={{ marginBottom: "1rem" }}
          >
            <Grid item>
              <StyledLink color="inherit" href={`/collections/${user._id}`}>
                <Avatar
                  style={{ marginRight: "1rem", width: "3rem", height: "3rem" }}
                  alt={user.name}
                  src={user.image}
                />
              </StyledLink>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              {user.name}
            </Grid>
            <Grid item>
              <Link passHref href={`/items/${item._id}/foundby/${user._id}`}>
                <StyledButton variant="contained" color="secondary">
                  <Visibility />
                </StyledButton>
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
        <Link passHref href={`/collect?itemId=${item._id}`}>
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
    </>
  );
};

export default ItemDetailsPage;
