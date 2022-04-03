import { CircularProgress } from "@material-ui/core";
import Image from "next/image";
import React from "react";

import { StyledButton } from "./StyledButton";

type ItemPreviewProps = {
  previewSource: string;
  isUploading: boolean;
};
export const ItemPreview = ({
  previewSource,
  isUploading,
}: ItemPreviewProps) => (
  <>
    <Image
      unoptimized
      width="400px"
      height="400px"
      src={previewSource}
      alt="Item image"
    />
    <StyledButton
      form="imageUploadForm"
      type="submit"
      size="large"
      fullWidth
      color="secondary"
      variant="contained"
      disabled={isUploading}
    >
      {isUploading ? <CircularProgress /> : "Submit Photo"}
    </StyledButton>
  </>
);
