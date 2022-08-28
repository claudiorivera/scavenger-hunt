import { AddAPhoto } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import { CollectContext } from "contexts/CollectContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useContext } from "react";

import { NotLoggedInMessage } from "./NotLoggedInMessage";

export const Collect = () => {
  const { data: session } = useSession();
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
              <Typography variant="h5" align="center" gutterBottom>
                Find
              </Typography>
              <Typography variant="h3" align="center" gutterBottom>
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
                    sx={{ display: "none" }}
                    name="imagePicker"
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    onChange={handleFileInputChange}
                    value={fileInput}
                  />
                  <Button
                    sx={{ mb: 2 }}
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
              <Box sx={{ mb: 1 }}>
                <Image
                  unoptimized
                  width="400px"
                  height="400px"
                  src={previewSource}
                  alt="Item image"
                />
              </Box>
              <Button
                form="imageUploadForm"
                type="submit"
                size="large"
                fullWidth
                color="secondary"
                variant="contained"
                disabled={isUploading}
                sx={{ mb: 2 }}
              >
                {isUploading ? <CircularProgress /> : "Submit Photo"}
              </Button>
            </>
          )}
          {uncollectedItems.length > 0 && (
            <Button
              size="large"
              fullWidth
              color="secondary"
              variant="contained"
              onClick={handleFindMore}
              sx={{ mb: 2 }}
            >
              Skip It!
            </Button>
          )}
          {currentItem && (
            <Link passHref href={`/items/${currentItem._id}`}>
              <Button
                size="large"
                fullWidth
                color="secondary"
                variant="contained"
              >
                See Who Found This
              </Button>
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
            <Button
              size="large"
              fullWidth
              color="secondary"
              variant="contained"
              onClick={handleFindMore}
            >
              Find More
            </Button>
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
          <Button
            size="large"
            fullWidth
            color="secondary"
            variant="contained"
            onClick={() => {
              router.push(`/collections/${session.user.id}`);
            }}
          >
            My Collection
          </Button>
        </>
      )}
    </>
  );
};
