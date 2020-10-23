import axios from "axios";
import { useSession } from "next-auth/client";
import { createContext, useEffect, useState } from "react";

export const CollectContext = createContext();

export const CollectProvider = ({ children, initialItems }) => {
  const [items, setItems] = useState(initialItems);
  const [session] = useSession();
  const [item, setItem] = useState(items[0]);
  const [fileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [successfulImageSource, setSuccessfulImageSource] = useState("");
  const [wasSuccessful, setWasSuccessful] = useState(false);

  // Adapted from https://medium.com/swlh/simple-react-app-with-context-and-functional-components-a374b7fb66b5
  useEffect(() => {
    setItem({ ...items[currentItemIndex] });
  }, [currentItemIndex]);

  const getNextItem = () => {
    let index = currentItemIndex;
    index === items.length - 1 ? (index = 0) : index++;
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
        item: item._id,
      });
      if (response.data.success) {
        setIsFetching(false);
        setSuccessfulImageSource(response.data.savedCollectionItem.imageUrl);
        setWasSuccessful(true);
        const newItems = await axios.get("/api/items?uncollected");
        setItems(newItems.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearFoundItem = async () => {
    setIsFetching(false);
    setWasSuccessful(false);
    setSuccessfulImageSource("");
    setPreviewSource("");
  };

  CollectContext.displayName = "Collect";

  return (
    <CollectContext.Provider
      value={{
        items,
        item,
        setItem,
        handleFileInputChange,
        handleSubmitFile,
        fileInput,
        previewSource,
        setPreviewSource,
        isFetching,
        setIsFetching,
        getNextItem,
        clearFoundItem,
        successfulImageSource,
        setSuccessfulImageSource,
        wasSuccessful,
        setWasSuccessful,
      }}
    >
      {children}
    </CollectContext.Provider>
  );
};
