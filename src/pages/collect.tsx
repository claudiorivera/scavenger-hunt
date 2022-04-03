import { Typography } from "@material-ui/core";
import { Item } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import useSWR from "swr";

import { FindItem, ItemPreview, StyledButton } from "~components";
import { useUser } from "~contexts";
import { getResizedCloudinaryUrls } from "~lib";

const CollectPage = () => {
  const { data: uncollectedItems, error: uncollectedItemsError } = useSWR<
    Item[]
  >("/api/items?uncollected");
  const { user, error } = useUser();
  const router = useRouter();
  const [showCollectSuccess, setShowCollectSuccess] = useState(false);
  const [collectSuccessImageUrl, setCollectSuccessImageUrl] = useState("");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [fileInput, setFileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (uncollectedItems) {
      if ("itemId" in router.query) {
        // Set the current item index to the index of the item in the query, if any
        const indexOfQueryItem = uncollectedItems.findIndex(
          (item: Item) => item.id === router.query.itemId
        );
        setCurrentItemIndex(indexOfQueryItem < 0 ? 0 : indexOfQueryItem);
      }
    }
  }, [currentItemIndex, uncollectedItems, router.query]);

  if (error || uncollectedItemsError) return <div>Oops, try refreshing!</div>;
  if (!user || !uncollectedItems) return <div>Loading...</div>;

  const getNextItemIndex = () =>
    currentItemIndex >= uncollectedItems.length - 1 ? 0 : currentItemIndex + 1;

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
      // Post to Cloudinary using upload preset for items
      const response = await axios.post(
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL,
        {
          file: base64EncodedImage,
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ITEMS,
        }
      );
      if (response.status === 200) {
        const { imageUrl, thumbnailUrl } = getResizedCloudinaryUrls(
          response.data.public_id
        );
        // Add to collections
        await axios.post("/api/collected-items", {
          imageUrl,
          thumbnailUrl,
          userId: user.id,
          itemId: uncollectedItems[currentItemIndex].id,
        });
        setIsUploading(false);
        setCollectSuccessImageUrl(imageUrl);
        setShowCollectSuccess(true);
      } else {
        throw "Something went wrong while uploading";
      }
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
    } else {
      resetCollectPage();
    }
  };

  // TODO: Separeate into discrete components and wrap with uncolledItems provider
  return (
    <>
      {!showCollectSuccess && uncollectedItems[currentItemIndex] && (
        <>
          <FindItem
            currentItem={uncollectedItems[currentItemIndex]}
            handleSubmitFile={handleSubmitFile}
            handleFileInputChange={handleFileInputChange}
            fileInput={fileInput}
          />
          {previewSource && (
            <ItemPreview
              previewSource={previewSource}
              isUploading={isUploading}
            />
          )}
          <StyledButton
            size="large"
            fullWidth
            color="secondary"
            variant="contained"
            onClick={handleFindMore}
          >
            Skip It!
          </StyledButton>
          <Link
            passHref
            href={`/items/${uncollectedItems[currentItemIndex].id}`}
          >
            <StyledButton
              size="large"
              fullWidth
              color="secondary"
              variant="contained"
            >
              See Who Found This
            </StyledButton>
          </Link>
        </>
      )}
      {showCollectSuccess && uncollectedItems[currentItemIndex] && (
        <>
          <Typography variant="h3" align="center" gutterBottom>
            You found {uncollectedItems[currentItemIndex].description}!
          </Typography>
          <Image
            src={collectSuccessImageUrl as string}
            height="500px"
            width="500px"
            alt="Successfully uploaded photo"
          />
          {!!uncollectedItems.length && (
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
      {!uncollectedItems.length && (
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
              router.push(`/users/${user.id}/collection`);
            }}
          >
            My Collection
          </StyledButton>
        </>
      )}
    </>
  );
};

export default CollectPage;
