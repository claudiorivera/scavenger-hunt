import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { CollectContext } from "context/Collect";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const CollectSuccess = () => {
  const {
    currentItem,
    collectSuccessImageUrl,
    showCollectSuccess,
    clearCurrentItem,
    getNextItem,
    uncollectedItems,
  } = useContext(CollectContext);
  const [session] = useSession();
  const router = useRouter();

  return showCollectSuccess ? (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">
        You found {currentItem.itemDescription}!
      </Typography>
      <img
        src={collectSuccessImageUrl}
        width="300px"
        alt="Successfully uploaded photo"
      />
      {uncollectedItems.length > 0 && (
        <StyledButton
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={() => {
            router.push("/collect");
            clearCurrentItem();
            getNextItem();
          }}
        >
          Find More
        </StyledButton>
      )}
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${session.user.id}`);
        }}
      >
        View My Collection
      </StyledButton>
    </Container>
  ) : (
    ""
  );
};

export default CollectSuccess;
