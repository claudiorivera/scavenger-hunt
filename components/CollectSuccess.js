import StyledButton from "@components/StyledButton";
import { Container, Typography } from "@material-ui/core";
import { CollectContext } from "context/Collect";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const CollectSuccess = () => {
  const {
    item,
    successfulImageSource,
    wasSuccessful,
    clearFoundItem,
    getNextItem,
  } = useContext(CollectContext);
  const [session] = useSession();
  const router = useRouter();

  return wasSuccessful ? (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">You found {item.itemDescription}!</Typography>
      <img
        src={successfulImageSource}
        width="300px"
        alt="Successfully uploaded photo"
      />
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/collect");
          clearFoundItem();
          getNextItem();
        }}
      >
        Find More
      </StyledButton>
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
