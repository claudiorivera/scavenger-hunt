import StyledButton from "@components/StyledButton";
import {
  Button,
  CircularProgress,
  Container,
  Input,
  styled,
  Typography,
} from "@material-ui/core";
import { AddAPhoto } from "@material-ui/icons";
import { CollectContext } from "context/Collect";
import Link from "next/link";
import React, { Fragment, useContext } from "react";

const StyledImage = styled("img")({
  margin: "2rem 0 1rem",
  maxHeight: "200px",
  width: "auto",
});

const Collect = () => {
  const {
    items,
    item,
    handleSubmitFile,
    fileInput,
    previewSource,
    isFetching,
    clearFoundItem,
    getNextItem,
    handleFileInputChange,
    wasSuccessful,
  } = useContext(CollectContext);

  return wasSuccessful ? (
    ""
  ) : (
    <Fragment>
      <Typography variant="h5">Find</Typography>
      <Typography variant="h3" gutterBottom>
        {item.itemDescription}
      </Typography>
      <form id="imageUploadForm" onSubmit={handleSubmitFile}>
        {/* Photo picker as a button - https://kiranvj.com/blog/blog/file-upload-in-material-ui/ */}
        <label htmlFor="imagePicker">
          <Input
            id="imagePicker"
            style={{ display: "none" }}
            name="imagePicker"
            type="file"
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
      {previewSource && (
        <Fragment>
          <Container>
            <StyledImage src={previewSource} alt="Item image" />
          </Container>
          <StyledButton
            form="imageUploadForm"
            type="submit"
            size="large"
            fullWidth
            color="secondary"
            variant="contained"
            disabled={isFetching}
          >
            {isFetching ? <CircularProgress /> : "Submit Photo"}
          </StyledButton>
        </Fragment>
      )}
      {/* Only show the skip button if there are more uncollected items
      or if we came to the collect page via /items/id "got one?" dialog */}
      {items.length > 1 && (
        <StyledButton
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={() => {
            clearFoundItem();
            getNextItem();
          }}
        >
          Skip It!
        </StyledButton>
      )}
      <Link href={`/items/${item._id}`}>
        <StyledButton
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
        >
          Who Found This?
        </StyledButton>
      </Link>
    </Fragment>
  );
};

export default Collect;
