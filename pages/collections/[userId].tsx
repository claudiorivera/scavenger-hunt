import LargeAvatar from "@components/LargeAvatar";
import MediumAvatar from "@components/MediumAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledLink from "@components/StyledLink";
import { Box, Container, Tooltip, Typography } from "@material-ui/core";
import { IItem } from "@types";
import fetcher from "@util/fetcher";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const CollectionsPage = () => {
  const [session] = useSession();
  const router = useRouter();
  const { data: user } = useSWR(`/api/users/${router.query.userId}`, fetcher);
  const { data: items } = useSWR(
    `/api/users/${router.query.userId}/collection`,
    fetcher
  );

  if (!session) return <NotLoggedInMessage />;
  if (!user || !items) return null;

  return (
    <Container maxWidth="xs">
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography align="center" variant="h3">
        {user.name}
      </Typography>
      <Typography align="center" variant="h5" gutterBottom>
        Found the Following Items:
      </Typography>
      {items.length > 0 ? (
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {items.map(
            ({
              _id,
              thumbnailUrl,
              item,
            }: {
              _id: number;
              thumbnailUrl: string;
              item: IItem;
            }) => (
              <StyledLink
                key={_id}
                href={`/items/${item._id}/foundby/${user._id}`}
              >
                <Tooltip
                  title={item.itemDescription}
                  aria-label={item.itemDescription}
                >
                  <MediumAvatar
                    style={{ margin: ".5rem" }}
                    alt={item.itemDescription}
                    src={thumbnailUrl}
                  />
                </Tooltip>
              </StyledLink>
            )
          )}
        </Box>
      ) : (
        <Typography align="center" variant="h5">
          Nothing, yet{" "}
          <span role="img" aria-label="sad face emoji">
            😢
          </span>
        </Typography>
      )}
    </Container>
  );
};

export default CollectionsPage;
