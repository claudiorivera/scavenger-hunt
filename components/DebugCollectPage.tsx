import { CollectContext } from "@context/Collect";
import React, { useContext } from "react";

const DebugCollectPage = () => {
  const {
    uncollectedItems,
    showCollectSuccess,
    collectSuccessImageUrl,
    currentItemIndex,
    currentItem,
    fileInput,
    previewSource,
    isUploading,
  } = useContext(CollectContext);

  return (
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
};

export default DebugCollectPage;
