import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { NotLoggedInMessage } from "components";
import { useCurrentUser } from "hooks";
import Error from "next/error";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();
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

  const handleUpdateNameChange = (e: FormEvent) => {
    setName((e.target as HTMLFormElement).value);
  };

  const handleFileInputChange = (e: SyntheticEvent<EventTarget>) => {
    const file = (e.target as HTMLFormElement).files[0];
    readFile(file);
  };

  const readFile = (file: Blob) => {
    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      uploadImage(reader.result as string);
    };
  };

  const uploadImage = async (base64EncodedImage: string) => {
    try {
      // Post to Cloudinary using upload preset for avatars
      const cloudinaryUploadResponse = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL}`,
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
        throw "Sorry, something went wrong while trying to upload";
      }
    } catch (error: any) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSavingChanges(true);
      const response = await axios.put(`/api/users/${user._id}`, {
        name,
        image,
      });
      if (response.status === 200) {
        router.push("/");
      } else {
        throw "Unable to update profile";
      }
    } catch (error: any) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  return (
    <>
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
          <Grid container>
            <span style={{ cursor: "pointer" }}>
              <Badge
                overlap="circular"
                color="primary"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                badgeContent={"Edit"}
              >
                {isUploadingPhoto ? (
                  <CircularProgress />
                ) : (
                  <Avatar
                    alt={name}
                    src={image}
                    style={{ width: "5rem", height: "5rem" }}
                  />
                )}
              </Badge>
            </span>
          </Grid>
        </label>
      </form>
      <Grid
        container
        onClick={handleDialogOpen}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography
            style={{ cursor: "pointer" }}
            variant="h5"
            align="center"
            gutterBottom
          >
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <EditIcon
            style={{ cursor: "pointer" }}
            fontSize="small"
            color="primary"
          />
        </Grid>
      </Grid>
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
      <Button
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={handleSaveChanges}
        disabled={isSavingChanges}
      >
        {isSavingChanges ? <CircularProgress /> : "Save Changes"}
      </Button>
    </>
  );
};

export default ProfilePage;
