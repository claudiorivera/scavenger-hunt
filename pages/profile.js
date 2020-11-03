import LargeAvatar from "@components/LargeAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import SonicWaiting from "@components/SonicWaiting";
import StyledButton from "@components/StyledButton";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  TextField,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import useCurrentUser from "@util/useCurrentUser";
import Axios from "axios";
import { useSession } from "next-auth/client";
import Error from "next/error";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [session] = useSession();
  const { user } = useCurrentUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [fileInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setImage(user.image);
    }
  }, [user]);

  if (!session) return <NotLoggedInMessage />;
  if (!user) return null;

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleUpdateNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    readFile(file);
  };

  const readFile = (file) => {
    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      // Post to Cloudinary using upload preset for avatars
      const cloudinaryUploadResponse = await Axios.post(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL}/image/upload`,
        {
          file: base64EncodedImage,
          upload_preset:
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_AVATARS,
        }
      );
      // Create image and thumbnail URLs with proper size/cropping
      if (cloudinaryUploadResponse.status === 200) {
        const newAvatarUrl =
          "https://res.cloudinary.com/" +
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME +
          "/w_80,h_80,c_fill,g_face,q_auto:best/" +
          cloudinaryUploadResponse.data.public_id;
        setIsUploadingPhoto(false);
        setImage(newAvatarUrl);
      } else {
        throw new Error("Sorry, something went wrong while trying to upload");
      }
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSavingChanges(true);
      const response = await Axios.put(`/api/user/${user._id}`, {
        name,
        image,
      });
      if (response.status === 200) {
        router.push("/");
      } else {
        throw new Error("Unable to update profile");
      }
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  return (
    <Container align="center" maxWidth="sm">
      <form id="imageUploadForm">
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
          <span style={{ cursor: "pointer" }}>
            <Badge
              overlap="circle"
              color="primary"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              badgeContent={"Edit"}
            >
              {isUploadingPhoto ? (
                <CircularProgress />
              ) : (
                <LargeAvatar alt={name} src={image} />
              )}
            </Badge>
          </span>
        </label>
      </form>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        onClick={handleDialogOpen}
      >
        <Typography style={{ cursor: "pointer" }} variant="h5">
          {name}
        </Typography>
        <EditIcon
          style={{ cursor: "pointer" }}
          fontSize="small"
          color="primary"
        />
      </Box>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Enter New Name</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={name}
            autoFocus
            margin="none"
            id="name"
            type="text"
            fullWidth
            onChange={handleUpdateNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={handleSaveChanges}
        disabled={isSavingChanges}
      >
        {isSavingChanges ? <SonicWaiting /> : "Save Changes"}
      </StyledButton>
    </Container>
  );
};

export default ProfilePage;
