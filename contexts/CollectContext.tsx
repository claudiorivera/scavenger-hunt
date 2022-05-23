import axios from "axios";
import { useUncollectedItems } from "hooks";
import { Item } from "models/Item";
import Error from "next/error";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

type ContextProps = {
  showCollectSuccess: boolean;
  collectSuccessImageUrl: string;
  currentItemIndex: number;
  currentItem: Item;
  fileInput: string;
  previewSource: string;
  isUploading: boolean;
  uncollectedItems: Item[];
  handleFileInputChange: (e: SyntheticEvent<EventTarget>) => void;
  handleFindMore: () => void;
  handleSubmitFile: (e: FormEvent) => void;
};

export const CollectContext = createContext<Partial<ContextProps>>({});
CollectContext.displayName = "CollectContext";

interface CollectProviderProps {
  children: React.ReactNode;
}

export const CollectProvider = ({ children }: CollectProviderProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { uncollectedItems, mutate } = useUncollectedItems();
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
        user: session?.user.id,
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
  return (
    <CollectContext.Provider
      value={{
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
      }}
    >
      {children}
    </CollectContext.Provider>
  );
};
