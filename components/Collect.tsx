import { Button, Input, Typography } from "@material-ui/core";
import { AddAPhoto } from "@material-ui/icons";
import { CollectContext } from "contexts/CollectContext";
import { useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import NotLoggedInMessage from "./NotLoggedInMessage";
import { SonicWaiting, StyledButton } from "./shared";

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

  if (!session) return <NotLoggedInMessage />;

  return (
    <>
      {!showCollectSuccess && uncollectedItems && uncollectedItems.length > 0 && (
        <>
          {currentItem && (
            <>
              <Typography variant="h5" gutterBottom>
                Find
              </Typography>
              <Typography variant="h3" gutterBottom>
                {currentItem.itemDescription}
              </Typography>
              {/* Photo picker as a button - https://kiranvj.com/blog/blog/file-upload-in-material-ui/ */}
              <form
                id="imageUploadForm"
                onSubmit={handleSubmitFile}
                style={{ width: "100%" }}
              >
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
            </>
          )}
          {previewSource && (
            <>
              <Image
                unoptimized
                width="400px"
                height="400px"
                src={previewSource}
                alt="Item image"
              />
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
            </>
          )}
          {uncollectedItems.length > 0 && (
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
            <Link passHref href={`/items/${currentItem._id}`}>
              <StyledButton
                size="large"
                fullWidth
                color="secondary"
                variant="contained"
              >
                See Who Found This
              </StyledButton>
            </Link>
          )}
        </>
      )}
      {showCollectSuccess && currentItem && (
        <>
          <Typography variant="h3" align="center" gutterBottom>
            You found {currentItem.itemDescription}!
          </Typography>
          <Image
            src={collectSuccessImageUrl as string}
            height="500px"
            width="500px"
            alt="Successfully uploaded photo"
          />
          {uncollectedItems && uncollectedItems.length > 0 && (
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
        </>
      )}
      {uncollectedItems && !uncollectedItems.length && (
        <>
          <Typography variant="h3" align="center" gutterBottom>
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
        </>
      )}
    </>
  );
};

export default Collect;
