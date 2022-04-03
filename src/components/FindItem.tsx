import { Button, Input, Typography } from "@material-ui/core";
import { AddAPhoto } from "@material-ui/icons";
import { Item } from "@prisma/client";
import { FormEvent, SyntheticEvent } from "react";

type FindItemProps = {
  currentItem: Item;
  handleSubmitFile: (e: FormEvent) => void;
  handleFileInputChange: (e: SyntheticEvent<EventTarget>) => void;
  fileInput: string;
};
export const FindItem = ({
  currentItem,
  handleSubmitFile,
  handleFileInputChange,
  fileInput,
}: FindItemProps) => (
  <>
    <Typography variant="h5" align="center" gutterBottom>
      Find
    </Typography>
    <Typography variant="h3" align="center" gutterBottom>
      {currentItem.description}
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
  </>
);
