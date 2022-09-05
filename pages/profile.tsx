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
import UserModel, { User } from "models/User";
import { GetServerSideProps } from "next";
import Error from "next/error";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { FormEvent, SyntheticEvent, useState } from "react";
import { dbConnect } from "util/dbConnect";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?callbackUrl=/profile",
        permanent: false,
      },
    };
  }

  try {
    await dbConnect();

    const user = await UserModel.findById(session.user._id).lean().exec();

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};

type Props = {
  user: User;
};

const ProfilePage = ({ user }: Props) => {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? user.email);
  const [image, setImage] = useState(
    user.image ?? `https://picsum.photos/seed/${user.email}/100/100`
  );
  const [fileInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

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
          <Grid container sx={{ mb: 2 }}>
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
                    sx={{ width: 100, height: 100 }}
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
            sx={{ cursor: "pointer" }}
            variant="h5"
            align="center"
            gutterBottom
          >
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <EditIcon
            sx={{ cursor: "pointer" }}
            fontSize="small"
            color="primary"
          />
        </Grid>
      </Grid>
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
    </>
  );
};

export default ProfilePage;
