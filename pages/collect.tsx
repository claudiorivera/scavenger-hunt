import { AddAPhoto } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import axios from "axios";
import ItemModel, { Item } from "models/Item";
import { GetServerSideProps } from "next";
import Error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Session, unstable_getServerSession } from "next-auth";
import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { dbConnect } from "util/dbConnect";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?callbackUrl=/collect",
        permanent: false,
      },
    };
  }

  await dbConnect();

  const uncollectedItems = await ItemModel.where("usersWhoCollected")
    .ne(session.user._id)
    .select("-addedBy -__v -usersWhoCollected")
    .lean();

  return {
    props: {
      session,
      uncollectedItems: JSON.parse(JSON.stringify(uncollectedItems)),
    },
  };
};

type Props = {
  session: Session;
  uncollectedItems: Item[];
};

const CollectPage = ({ session, uncollectedItems }: Props) => {
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
          (item: Item) => String(item._id) === router.query.itemId
        );
        setCurrentItemIndex(index === -1 ? 0 : index);
      }
      setCurrentItem(uncollectedItems[currentItemIndex]);
    }
  }, [currentItemIndex, uncollectedItems, router.query]);

  // https://medium.com/swlh/simple-react-app-with-context-and-functional-components-a374b7fb66b5
  const getNextItemIndex = () => {
    let index = currentItemIndex;
    index === uncollectedItems.length - 1 ? (index = 0) : index++;
    return index;
  };

  // Photo picker and upload https://www.youtube.com/watch?v=Rw_QeJLnCK4
  // TS event type https://stackoverflow.com/a/59105621/6520955
  const handleFileInputChange = (e: SyntheticEvent<EventTarget>) => {
    const file = (e.target as HTMLFormElement).files[0];
    previewFile(file);
  };

  const previewFile = (file: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result as string);
    };
  };

  const handleSubmitFile = (e: FormEvent) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const uploadImage = async (base64EncodedImage: string) => {
    try {
      setIsUploading(true);
      let imageUrl = "";
      let thumbnailUrl = "";
      // Post to Cloudinary using upload preset for items
      const cloudinaryUploadResponse = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL}`,
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
        throw "Something went wrong while uploading";
      }
      // Add to collections
      await axios.post("/api/collectionitems", {
        imageUrl,
        thumbnailUrl,
        user: session?.user._id,
        item: currentItem._id,
      });
      setIsUploading(false);
      setCollectSuccessImageUrl(imageUrl);
      setShowCollectSuccess(true);
    } catch (error: any) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  const resetCollectPage = () => {
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

  return (
    <>
      {!showCollectSuccess && !!uncollectedItems?.length && (
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
          {!!uncollectedItems?.length && (
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
          {!!currentItem && (
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
      {showCollectSuccess && !!currentItem && (
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
          {!!uncollectedItems?.length && (
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
      {!uncollectedItems?.length && (
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
              router.push(`/collections/${session.user._id}`);
            }}
          >
            My Collection
          </Button>
        </>
      )}
    </>
  );
};

export default CollectPage;
