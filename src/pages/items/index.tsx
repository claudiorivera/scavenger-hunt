import { Grid, Typography } from "@material-ui/core";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import { Item } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { StyledButton } from "~components";
import { useUser } from "~contexts";

const ItemsPage = () => {
  const { user, error } = useUser();
  const { data: items, error: itemsError } = useSWR<Item[]>("/api/items");
  const [collectedItemIds, setCollectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setCollectedItemIds(
        user.collectedItems.map((item) => item.originalItem.id)
      );
    }
  }, [user, items]);

  if (!items || !user) return <div>Loading...</div>;
  if (error || itemsError) return <div>Oops, try refreshing!</div>;

  return (
    <>
      <Typography variant="h3" align="center" gutterBottom>
        All Items
      </Typography>
      {items.map(({ id, description }) => (
        <Grid
          container
          key={id}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item style={{ flexGrow: 1 }}>
            <Link passHref href={`/items/${id}`}>
              <StyledButton fullWidth variant="contained" color="secondary">
                {description}
              </StyledButton>
            </Link>
          </Grid>
          <Grid item>
            {collectedItemIds.includes(id) ? (
              <CheckCircle color="secondary" />
            ) : (
              <RadioButtonUnchecked color="secondary" />
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default ItemsPage;
