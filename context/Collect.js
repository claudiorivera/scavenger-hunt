import useUncollectedItems from "@util/useUncollectedItems";
import axios from "axios";
import { useSession } from "next-auth/client";
import { createContext, useEffect, useState } from "react";

export const CollectContext = createContext();

export const CollectProvider = ({ children, startWithItem, initialData }) => {
  const { uncollectedItems } = useUncollectedItems(initialData);
  const [session] = useSession();
  const [currentItemIndex, setCurrentItemIndex] = useState(
    // If a startWithItem was passed in (via query on collect page), then the index
    // is the index of the item in uncollectedItems array that matches the starting item's id
    // Otherwise, it's 0 (first item)
    startWithItem
      ? uncollectedItems.findIndex((item) => item._id === startWithItem._id)
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
      // TODO: Upload to Cloudinary directly, before calling our API
      // Mock photos for now
      const response = await axios.post("/api/collections", {
        imageUrl: "http://picsum.photos/400",
        thumbnailUrl: "http://picsum.photos/100",
        user: session.user.id,
        item: currentItem._id,
      });
      setIsUploading(false);
      setCollectSuccessImageUrl(response.data.savedCollectionItem.imageUrl);
      setShowCollectSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  CollectContext.displayName = "Collect";

  return (
    <CollectContext.Provider
      value={{
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
          },
          null,
          2
        )}
      </pre>
      {children}
    </CollectContext.Provider>
  );
};
