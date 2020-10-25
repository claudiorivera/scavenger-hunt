import useUncollectedItems from "@util/useUncollectedItems";
import axios from "axios";
import { useSession } from "next-auth/client";
import Error from "next/error";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const CollectContext = createContext();

export const CollectProvider = ({ children, initialData }) => {
  const router = useRouter();
  const { uncollectedItems, mutate } = useUncollectedItems(initialData);
  const [session] = useSession();
  const [currentItemIndex, setCurrentItemIndex] = useState(
    // If there's a itemId specified, then the index is the index of the item
    // in uncollectedItems array that matches the starting item's id, otherwise 0 (first item)
    router.query?.itemId
      ? uncollectedItems.findIndex((item) => item._id === router.query.itemId)
      : 0
  );
  const [currentItem, setCurrentItem] = useState(
    uncollectedItems[currentItemIndex]
  );
  const [showCollectSuccess, setShowCollectSuccess] = useState(false);
  const [fileInput, setFileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [collectSuccessImageUrl, setCollectSuccessImageUrl] = useState("");

  // Adapted from https://medium.com/swlh/simple-react-app-with-context-and-functional-components-a374b7fb66b5
  useEffect(() => {
    setCurrentItem(uncollectedItems[currentItemIndex]);
  }, [currentItemIndex]);

  const getNextItem = () => {
    let index = currentItemIndex;
    index === uncollectedItems.length - 1 ? (index = 0) : index++;
    setCurrentItemIndex(index);
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
      // Mock values to start with and default to
      let imageUrl = "http://picsum.photos/512";
      let thumbnailUrl = "http://picsum.photos/80";
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
      // Add to collections via our API
      await axios.post("/api/collections", {
        imageUrl,
        thumbnailUrl,
        user: session.user.id,
        item: currentItem._id,
      });
      setIsUploading(false);
      setCollectSuccessImageUrl(imageUrl);
      setShowCollectSuccess(true);
      mutate();
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  CollectContext.displayName = "Collect";

  return (
    <CollectContext.Provider
      value={{
        currentItemIndex,
        mutate,
        uncollectedItems,
        currentItem,
        getNextItem,
        showCollectSuccess,
        handleSubmitFile,
        handleFileInputChange,
        fileInput,
        previewSource,
        isUploading,
        collectSuccessImageUrl,
        setShowCollectSuccess,
        setFileInput,
        setPreviewSource,
        setIsUploading,
        setCollectSuccessImageUrl,
      }}
    >
      <pre>
        context:
        {JSON.stringify(
          {
            currentItemIndex,
            mutate,
            uncollectedItems,
            currentItem,
            getNextItem,
            showCollectSuccess,
            handleSubmitFile,
            handleFileInputChange,
            fileInput,
            previewSource,
            isUploading,
            collectSuccessImageUrl,
            setShowCollectSuccess,
            setFileInput,
            setPreviewSource,
            setIsUploading,
            setCollectSuccessImageUrl,
          },
          null,
          2
        )}
      </pre>
      {children}
    </CollectContext.Provider>
  );
};
