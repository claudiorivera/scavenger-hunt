import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import StyledImage from "@components/StyledImage";
import { Button, Container, Input, Typography } from "@material-ui/core";
import { AddAPhoto } from "@material-ui/icons";
import middleware from "@middleware";
import Item from "@models/Item";
import useUncollectedItems from "@util/useUncollectedItems";
import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

const CollectPage = ({ initialUncollectedItems }) => {
  const Debug = () => (
    <pre>
      {JSON.stringify(
        {
          uncollectedItems,
          showCollectSuccess,
          collectSuccessImageUrl,
          currentItemIndex,
          currentItem,
          fileInput,
          previewSource,
          isUploading,
        },
        null,
        2
      )}
    </pre>
  );
  const showDebug = true;

  const [session] = useSession();
  const { uncollectedItems, mutate } = useUncollectedItems(
    initialUncollectedItems
  );
  const router = useRouter();

  const [showCollectSuccess, setShowCollectSuccess] = useState(false);
  const [collectSuccessImageUrl, setCollectSuccessImageUrl] = useState("");

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState(
    uncollectedItems[currentItemIndex]
  );

  const [fileInput, setFileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (uncollectedItems) {
      if ("itemId" in router.query) {
        // Set the current item index to the index of the item in the query, if any
        const index = uncollectedItems.findIndex(
          (item) => item._id === router.query.itemId
        );
        setCurrentItemIndex(index === -1 ? 0 : index);
      }
      setCurrentItem(uncollectedItems[currentItemIndex]);
    }
  }, [currentItemIndex, showCollectSuccess]);

  // https://medium.com/swlh/simple-react-app-with-context-and-functional-components-a374b7fb66b5
  const getNextItemIndex = () => {
    let index = currentItemIndex;
    index === uncollectedItems.length - 1 ? (index = 0) : index++;
    return index;
  };

  // Photo picker and upload https://www.youtube.com/watch?v=Rw_QeJLnCK4
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      setIsUploading(true);
      let imageUrl = "";
      let thumbnailUrl = "";
      // Post to Cloudinary using upload preset for items
      const cloudinaryUploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/image/upload`,
        {
          file: base64EncodedImage,
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ITEMS,
        }
      );
      // Create image and thumbnail URLs with proper size/cropping
      if (cloudinaryUploadResponse.status === 200) {
        imageUrl =
          "https://res.cloudinary.com/" +
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
          "/w_512,h_512,c_fill,g_center,q_auto:best/" +
          cloudinaryUploadResponse.data.public_id;
        thumbnailUrl =
          "https://res.cloudinary.com/" +
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
          "/w_80,h_80,c_fill,g_center,q_auto:best/" +
          cloudinaryUploadResponse.data.public_id;
      } else {
        throw new Error("Sorry, something went wrong while trying to upload");
      }
      // Add to collections
      await axios.post("/api/collections", {
        imageUrl,
        thumbnailUrl,
        user: session.user.id,
        item: currentItem._id,
      });
      setIsUploading(false);
      setCollectSuccessImageUrl(imageUrl);
      setShowCollectSuccess(true);
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  const resetCollectPage = () => {
    mutate();
    setCurrentItemIndex(getNextItemIndex());
    setFileInput("");
    setPreviewSource("");
    setCollectSuccessImageUrl("");
    setShowCollectSuccess(false);
  };

  const handleFindMore = () => {
    if ("itemId" in router.query) {
      router.push("/collect");
      resetCollectPage();
      setCurrentItemIndex(getNextItemIndex());
    } else {
      resetCollectPage();
      setCurrentItemIndex(getNextItemIndex());
    }
  };

  if (!session) return <NotLoggedInMessage />;
  if (!uncollectedItems) return <SonicWaiting />;

  return (
    <Fragment>
      {showDebug && <Debug />}
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

export default CollectPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const initialUncollectedItems = await Item.where("usersWhoCollected")
      .ne(session.user.id)
      .select("-addedBy -__v -usersWhoCollected")
      .lean();
    return {
      props: {
        initialUncollectedItems: JSON.parse(
          JSON.stringify(initialUncollectedItems)
        ),
      },
    };
  } else
    return {
      props: {
        initialUncollectedItems: [],
      },
    };
};
