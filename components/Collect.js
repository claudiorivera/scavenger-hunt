import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledImage from "@components/StyledImage";
import { CollectContext } from "@context/Collect";
import { Button, Container, Input, Typography } from "@material-ui/core";
import { AddAPhoto } from "@material-ui/icons";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useContext } from "react";

const Collect = () => {
  const [session] = useSession();
  const router = useRouter();
  const {
    collectSuccessImageUrl,
    currentItem,
    fileInput,
    handleFileInputChange,
    handleFindMore,
    handleSubmitFile,
    isUploading,
    previewSource,
    showCollectSuccess,
    uncollectedItems,
  } = useContext(CollectContext);

  if (!session) return <SonicWaiting />;

  return (
    <Fragment>
      <Container maxWidth="xs" align="center">
        {!showCollectSuccess && uncollectedItems.length > 0 && (
          <Fragment>
            {currentItem && (
              <Fragment>
                <Typography variant="h5">Find</Typography>
                <Typography variant="h3" gutterBottom>
                  {currentItem.itemDescription}
                </Typography>
                {/* Photo picker as a button - https://kiranvj.com/blog/blog/file-upload-in-material-ui/ */}
                <form id="imageUploadForm" onSubmit={handleSubmitFile}>
                  <label htmlFor="imagePicker">
                    <Input
                      id="imagePicker"
                      style={{ display: "none" }}
                      name="imagePicker"
                      type="file"
                      inputProps={{ accept: "image/*" }}
                      onChange={handleFileInputChange}
                      value={fileInput}
                    />
                    <Button
                      style={{ marginBottom: ".5rem" }}
                      size="large"
                      fullWidth
                      color="secondary"
                      variant="contained"
                      component="span"
                    >
                      <AddAPhoto />
                    </Button>
                  </label>
                </form>
              </Fragment>
            )}
            {previewSource && (
              <Fragment>
                <Container>
                  <StyledImage src={previewSource} alt="Item image" />
                </Container>
                <StyledButton
                  form="imageUploadForm"
                  type="submit"
                  size="large"
                  fullWidth
                  color="secondary"
                  variant="contained"
                  disabled={isUploading}
                >
                  {isUploading ? <SonicWaiting /> : "Submit Photo"}
                </StyledButton>
              </Fragment>
            )}
            {uncollectedItems.length > 1 && (
              <StyledButton
                size="large"
                fullWidth
                color="secondary"
                variant="contained"
                onClick={handleFindMore}
              >
                Skip It!
              </StyledButton>
            )}
            {currentItem && (
              <Link href={`/items/${currentItem._id}`}>
                <StyledButton
                  size="large"
                  fullWidth
                  color="secondary"
                  variant="contained"
                >
                  Who Found This?
                </StyledButton>
              </Link>
            )}
          </Fragment>
        )}
        {showCollectSuccess && currentItem && (
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
                onClick={handleFindMore}
              >
                Find More
              </StyledButton>
            )}
          </Fragment>
        )}
        {!uncollectedItems.length && (
          <Fragment>
            <Typography variant="h3">
              You Found All The Items!&nbsp;
              <span role="img" aria-label="celebrate emoji">
                🎉
              </span>
            </Typography>
            <StyledButton
              size="large"
              fullWidth
              color="secondary"
              variant="contained"
              onClick={() => {
                router.push(`/collections/${session.user.id}`);
              }}
            >
              My Collection
            </StyledButton>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
};

export default Collect;
