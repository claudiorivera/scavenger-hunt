import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { NotLoggedInMessage } from "components";
import { StyledButton } from "components/shared";
import { useCurrentUser } from "hooks";
import { CollectionItem } from "models/CollectionItem";
import { User } from "models/User";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { useState } from "react";
import useSWR from "swr";
import { capitalizeEachWordOfString } from "util/index";

const AdminPage = () => {
  const { data: session } = useSession();
  const { user } = useCurrentUser();
  const [itemDescription, setItemDescription] = useState("");
  const { data: items, mutate: mutateCollectionItems } = useSWR(
    "/api/collectionitems"
  );
  const { data: users, mutate: mutateUsers } = useSWR("/api/users");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Types.ObjectId>();
  const [isUserDeleteDialogOpen, setIsUserDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Types.ObjectId>();

  if (!session) return <NotLoggedInMessage />;
  if (!user) return null;
  if (!user.isAdmin)
    return (
      <Typography variant="h5" align="center" gutterBottom>
        You must be logged in as an admin to view this page.
      </Typography>
    );

  const handleSubmit = async (itemDescription: string) => {
    try {
      await axios.post("/api/items", { itemDescription });
    } catch (error: any) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  return (
    <>
      <Typography variant="h3" align="center">
        Add New Item
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(itemDescription);
          setItemDescription("");
        }}
        style={{ width: "100%", marginBottom: "2rem" }}
      >
        <TextField
          autoFocus={true}
          name="newItem"
          required
          id="newItem"
          label="Add New Item"
          placeholder="Enter the item description"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={itemDescription}
          onChange={(e) =>
            setItemDescription(capitalizeEachWordOfString(e.target.value))
          }
        />
        <StyledButton
          type="submit"
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
        >
          Add Item
        </StyledButton>
      </form>
      {items && (
        <>
          <Typography variant="h3" align="center">
            Delete Collection Items
          </Typography>
          <Grid
            container
            justifyContent="center"
            style={{ marginBottom: "2rem" }}
          >
            {items.map(({ _id, thumbnailUrl, item }: CollectionItem) => (
              <Grid item key={String(_id)}>
                <Tooltip title={item.itemDescription}>
                  <Avatar
                    style={{
                      margin: ".5rem",
                      cursor: "pointer",
                      width: "3rem",
                      height: "3rem",
                    }}
                    alt={"a collection item"}
                    src={thumbnailUrl}
                    onClick={() => {
                      setItemToDelete(_id);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
          <Dialog
            open={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Delete?</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this collection item?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                }}
                color="secondary"
                variant="outlined"
              >
                No
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await axios.delete(`/api/collectionitems/${itemToDelete}`);
                    setIsDeleteDialogOpen(false);
                    mutateCollectionItems();
                  } catch (error: any) {
                    return <Error statusCode={500} title={error.message} />;
                  }
                }}
                color="primary"
                variant="outlined"
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {users && (
        <>
          <Typography variant="h3">Delete Users</Typography>
          <Grid
            container
            justifyContent="center"
            style={{ marginBottom: "2rem" }}
          >
            {users.map(({ _id, image, name }: User) => (
              <Tooltip key={String(_id)} title={name}>
                <Avatar
                  style={{
                    margin: ".5rem",
                    cursor: "pointer",
                    width: "3rem",
                    height: "3rem",
                  }}
                  alt={name}
                  src={image}
                  onClick={() => {
                    setUserToDelete(_id);
                    setIsUserDeleteDialogOpen(true);
                  }}
                />
              </Tooltip>
            ))}
          </Grid>
          <Dialog
            open={isUserDeleteDialogOpen}
            onClose={() => {
              setIsUserDeleteDialogOpen(false);
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Delete?</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this user?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setIsUserDeleteDialogOpen(false);
                }}
                color="secondary"
                variant="outlined"
              >
                No
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await axios.delete(`/api/users/${userToDelete}`);
                    setIsUserDeleteDialogOpen(false);
                    mutateUsers();
                    mutateCollectionItems();
                  } catch (error: any) {
                    return <Error statusCode={500} title={error.message} />;
                  }
                }}
                color="primary"
                variant="outlined"
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default AdminPage;
