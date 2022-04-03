import { Typography } from "@material-ui/core";
import { CollectedItem, Item, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import { StyledButton } from "~components";

type PopulatedCollectedItem = CollectedItem & {
  originalItem: Item;
  foundBy: User;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { itemId, userId } = query;

  return {
    props: {
      itemId,
      userId,
    },
  };
};

type ItemFoundByDetailsProps = {
  itemId: string;
  userId: string;
};
const ItemFoundByDetails = ({ itemId, userId }: ItemFoundByDetailsProps) => {
  const { data: collectedItem, error } = useSWR<PopulatedCollectedItem>(
    `/api/collected-items?itemId=${itemId}&userId=${userId}`
  );

  if (error) return <div>Oops, try refreshing!</div>;
  if (!collectedItem) return <div>Loading...</div>;

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        {collectedItem.foundBy.name} Found{" "}
        {collectedItem.originalItem.description}!
      </Typography>
      <Image
        height="512px"
        width="512px"
        src={collectedItem.imageUrl}
        alt={collectedItem.originalItem.description}
      />
      {collectedItem.foundById !== userId && (
        <Link
          passHref
          href={`/collect?itemId=${collectedItem.originalItem.id}`}
        >
          <StyledButton fullWidth variant="contained" color="secondary">
            Found It?
          </StyledButton>
        </Link>
      )}
      <Link passHref href={`/items/${collectedItem.originalItem.id}`}>
        <StyledButton fullWidth variant="contained" color="secondary">
          See Who Found This
        </StyledButton>
      </Link>
    </>
  );
};

export default ItemFoundByDetails;
