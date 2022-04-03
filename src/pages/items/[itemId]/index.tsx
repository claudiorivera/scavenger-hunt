import { Avatar, Grid, Typography } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { CollectedItem, Item, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { StyledButton, StyledLink } from "~components";
import { showItemAttribution } from "~config";
import { useUser } from "~contexts";

type PopulatedItem = Item & {
  createdBy: User;
};

type PopulatedCollectedItem = CollectedItem & {
  originalItem: PopulatedItem;
  foundBy: User;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { itemId } = query;

  return {
    props: {
      itemId,
    },
  };
};

type ItemDetailsPageProps = {
  itemId: string;
};
const ItemDetailsPage = ({ itemId }: ItemDetailsPageProps) => {
  const { user, error } = useUser();
  const { data: collectedItems, error: collectedItemsError } = useSWR<
    PopulatedCollectedItem[]
  >(`/api/collected-items?itemId=${itemId}`);
  const [item, setItem] = useState<PopulatedItem>();
  const [foundByIds, setFoundByIds] = useState<string[]>([]);

  useEffect(() => {
    if (collectedItems) {
      setItem(collectedItems[0].originalItem);
      setFoundByIds(
        collectedItems.map((collectedItem) => collectedItem.foundById)
      );
    }
  }, [collectedItems]);

  if (error || collectedItemsError) return <div>Oops, try refreshing!</div>;
  if (!user || !collectedItems || !item) return <div>Loading...</div>;

  return (
    <>
      <Typography variant="h3" align="center">
        {item.description}
      </Typography>
      {showItemAttribution && item.createdBy && (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          style={{ marginBottom: "1rem" }}
        >
          <Typography variant="caption">Added by:</Typography>
          <StyledLink
            color="inherit"
            style={{ display: "flex", alignItems: "center" }}
            href={`/users/${item.createdBy.id}/collection`}
          >
            <Avatar
              alt={item.createdBy.name!}
              src={item.createdBy.image!}
              style={{ width: "1rem", height: "1rem" }}
            />
            {item.createdBy.name}
          </StyledLink>
        </Grid>
      )}
      <Typography variant="h5" align="center" gutterBottom>
        Collected by:
      </Typography>
      {!!collectedItems.length ? (
        collectedItems.map((collectedItem) => (
          <Grid
            container
            key={collectedItem.foundBy.id}
            alignItems="center"
            style={{ marginBottom: "1rem" }}
          >
            <Grid item>
              <StyledLink
                color="inherit"
                href={`/users/${collectedItem.foundBy.id}/collection`}
              >
                <Avatar
                  style={{ marginRight: "1rem", width: "3rem", height: "3rem" }}
                  alt={collectedItem.foundBy.name!}
                  src={collectedItem.foundBy.image!}
                />
              </StyledLink>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              {collectedItem.foundBy.name}
            </Grid>
            <Grid item>
              <Link
                passHref
                href={`/items/${item.id}/found-by/${collectedItem.foundBy.id}`}
              >
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
      {!foundByIds.includes(user.id) && (
        <Link passHref href={`/collect?itemId=${item.id}`}>
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
    </>
  );
};

export default ItemDetailsPage;
