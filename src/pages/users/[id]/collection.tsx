import { Avatar, Grid, Tooltip, Typography } from "@material-ui/core";
import { CollectedItem, Item, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import useSWR from "swr";

import { StyledLink } from "~components";
import { fetcher } from "~lib";

type PopulatedUser = User & {
  collectedItems: (CollectedItem & { originalItem: Item })[];
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      userId: query.id,
    },
  };
};

type CollectionsPageProps = {
  userId: string;
};
const CollectionsPage = ({ userId }: CollectionsPageProps) => {
  const { data: user, error } = useSWR<PopulatedUser>(
    `/api/users/${userId}`,
    fetcher
  );

  if (error) return <div>Oops, try refreshing!</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Avatar
        style={{ width: "5rem", height: "5rem", margin: "0 auto" }}
        alt={user.name as string}
        src={user.image as string}
      />
      <Typography variant="h3" align="center">
        {user.name}
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        Found the Following Items:
      </Typography>
      <Grid container justifyContent="center">
        {user.collectedItems.map(({ id, thumbnailUrl, originalItem }) => (
          <Grid item key={id}>
            <StyledLink href={`/items/${originalItem.id}/found-by/${user.id}`}>
              <Tooltip
                title={originalItem.description}
                aria-label={originalItem.description}
              >
                <Avatar
                  style={{ margin: ".5rem", width: "3rem", height: "3rem" }}
                  alt={originalItem.description}
                  src={thumbnailUrl}
                />
              </Tooltip>
            </StyledLink>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default CollectionsPage;
