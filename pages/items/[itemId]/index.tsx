import { Avatar, Grid, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { NotLoggedInMessage } from "components";
import { StyledButton, StyledLink } from "components/shared";
import { showItemAttribution } from "config";
import { User } from "models/User";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const ItemDetailsPage = () => {
  const [session] = useSession();
  const router = useRouter();
  const { data: item } = useSWR(`/api/items/${router.query.itemId}`);

  if (!session) return <NotLoggedInMessage />;
  if (!item) return null;

  const userIdsWhoCollected = item.usersWhoCollected.map(
    (user: User) => user._id
  );

  return (
    <>
      <Typography variant="h3">{item.itemDescription}</Typography>
      {showItemAttribution && item.addedBy && (
        <Grid
          container
          alignItems="center"
          justify="center"
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
      <Typography variant="h5" gutterBottom>
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
        <Typography variant="h5">
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
