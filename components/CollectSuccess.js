import StyledButton from "@components/StyledButton";
import { Typography } from "@material-ui/core";
import { CollectContext } from "context/Collect";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { Fragment, useContext } from "react";

const CollectSuccess = () => {
  const {
    uncollectedItems,
    currentItem,
    collectSuccessImageUrl,
    showCollectSuccess,
    setShowCollectSuccess,
    setFileInput,
    setPreviewSource,
    setIsUploading,
    setCollectSuccessImageUrl,
    setCurrentItemIndex,
  } = useContext(CollectContext);
  const [session] = useSession();
  const router = useRouter();

  const getNextItem = () => {
    setShowCollectSuccess(false);
    setFileInput("");
    setPreviewSource("");
    setIsUploading(false);
    setCollectSuccessImageUrl("");
    setCurrentItemIndex(0);
  };

  return showCollectSuccess ? (
    <Fragment>
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
            if (router.query) {
              getNextItem();
              return router.push("/collect");
            }
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
    </Fragment>
  ) : (
    ""
  );
};

export default CollectSuccess;
