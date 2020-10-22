import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import {
  Button,
  CircularProgress,
  Container,
  Input,
  styled,
  Typography,
} from "@material-ui/core";
import { AddAPhoto as AddAPhotoIcon } from "@material-ui/icons";
import middleware from "@middleware";
import Item from "@models/Item";
import axios from "axios";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

const StyledImage = styled("img")({
  width: "100%",
  margin: "2rem 0 1rem",
});

const CollectPage = ({ items }) => {
  const [session] = useSession();
  const [item, setItem] = useState(items[0]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const router = useRouter();
  const [fileInput] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [successfulImageSource, setSuccessfulImageSource] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // TODO: Start with whatever item was passed in as a query, if any
  useEffect(() => {
    if (router.query.itemId) {
      console.log(`query ${router.query.itemId} passed in`);
    }
  }, []);

  // Adapted from https://medium.com/swlh/simple-react-app-with-context-and-functional-components-a374b7fb66b5
  useEffect(() => {
    setItem({ ...items[currentItemIndex] });
  }, [currentItemIndex]);

  const getNextItem = () => {
    let index = currentItemIndex;
    index === items.length - 1 ? (index = 0) : index++;
    setCurrentItemIndex(index);
  };

  // https://www.youtube.com/watch?v=Rw_QeJLnCK4
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clearFoundItem = () => {
    setIsFetching(false);
    setWasSuccessful(false);
    setSuccessfulImageSource("");
    setPreviewSource("");
  };

  if (!session) return <NotLoggedInMessage />;

  return wasSuccessful ? (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">You found {item.itemDescription}!</Typography>
      <img
        src={successfulImageSource}
        width="300px"
        alt="Successfully uploaded photo"
      />
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
        Find More
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${session.user.id}`);
        }}
      >
        View My Collection
      </StyledButton>
    </Container>
  ) : items.length ? (
    <Container align="center" maxWidth="xs">
      <Typography variant="h4">Find</Typography>
      <Typography variant="h2" gutterBottom>
        {item.itemDescription}
      </Typography>
      <form id="imageUploadForm" onSubmit={handleSubmitFile}>
        {/* https://kiranvj.com/blog/blog/file-upload-in-material-ui/ */}
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
            startIcon={<AddAPhotoIcon />}
            fullWidth
            color="secondary"
            variant="contained"
            component="span"
          >
            Found It!
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
    </Container>
  ) : (
    <Container align="center" maxWidth="xs">
      <Typography variant="h1">You Found All The Items!</Typography>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/collections/${session.user.id}`);
        }}
      >
        My Collection
      </StyledButton>
    </Container>
  );
};

export default CollectPage;

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const items = await Item.where("usersWithItemCollected")
      .ne(session.user.id)
      .select("-addedBy")
      .lean();
    return {
      props: {
        items: JSON.parse(JSON.stringify(items)),
      },
    };
  } else
    return {
      props: {
        items: [],
      },
    };
};
