import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useSession } from "next-auth/client";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) =>
  axios.get(url).then((res) => res.data.uncollectedItems);

export const CollectContext = createContext();

export const CollectProvider = ({
  children,
  initialUncollectedItems,
  startWithItem,
}) => {
  const { data: uncollectedItems, mutate } = useSWR(
    "api/items?uncollected",
    fetcher,
    {
      initialData: initialUncollectedItems,
    }
  );
  const [session] = useSession();
  const [currentItemIndex, setCurrentItemIndex] = useState(
    // If a startWithItem was passed in (via query params on collect page), then the index
    // is the index of the item in uncollectedItems array that matches the starting item's id
    // Otherwise, it's 0 (first item)
    startWithItem
      ? uncollectedItems.findIndex((item) => item._id === startWithItem._id)
      : 0
  );
  const [currentItem, setCurrentItem] = useState(
    uncollectedItems[currentItemIndex]
  );
  const [fileInput, setFileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [collectSuccessImageUrl, setCollectSuccessImageUrl] = useState("");
  const [showCollectSuccess, setShowCollectSuccess] = useState(false);

  if (!uncollectedItems) return <CircularProgress />;

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
      setIsFetching(true);
      const response = await axios.post("/api/collections", {
        imageDataString: base64EncodedImage,
        user: session.user.id,
        item: currentItem._id,
      });
      if (response.data.success) {
        setIsFetching(false);
        setCollectSuccessImageUrl(response.data.savedCollectionItem.imageUrl);
        setShowCollectSuccess(true);
        mutate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearCurrentItem = () => {
    setIsFetching(false);
    setShowCollectSuccess(false);
    setCollectSuccessImageUrl("");
    setPreviewSource("");
    setFileInput("");
  };

  CollectContext.displayName = "Collect";

  return (
    <CollectContext.Provider
      value={{
        uncollectedItems,
        currentItem,
        setCurrentItem,
        handleFileInputChange,
        handleSubmitFile,
        fileInput,
        previewSource,
        setPreviewSource,
        isFetching,
        setIsFetching,
        getNextItem,
        clearCurrentItem,
        collectSuccessImageUrl,
        setCollectSuccessImageUrl,
        showCollectSuccess,
        setShowCollectSuccess,
      }}
    >
      {children}
    </CollectContext.Provider>
  );
};
