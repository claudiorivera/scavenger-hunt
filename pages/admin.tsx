import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { NotLoggedInMessage } from "components";
import { MediumAvatar, StyledButton, StyledDivider } from "components/shared";
import { useCurrentUser } from "hooks";
import { CollectionItem } from "models/CollectionItem";
import { User } from "models/User";
import { Types } from "mongoose";
import { useSession } from "next-auth/client";
import Error from "next/error";
import { useState } from "react";
import useSWR from "swr";
import { capitalizeEachWordOfString } from "util/index";

const AdminPage = () => {
  const [session] = useSession();
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
      <Typography variant="h5">
        You must be logged in as an admin to view this page.
      </Typography>
    );

  const handleSubmit = async (itemDescription: string) => {
    try {
      await axios.post("/api/items", { itemDescription });
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  return (
    <>
      <Typography variant="h3">Add New Item</Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(itemDescription);
          setItemDescription("");
        }}
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
          <StyledDivider />
          <Typography variant="h3">Delete Collection Items</Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {items.map(({ _id, thumbnailUrl, item }: CollectionItem) => (
              <Tooltip key={String(_id)} title={item.itemDescription}>
                <MediumAvatar
                  style={{ margin: ".5rem", cursor: "pointer" }}
                  alt={"a collection item"}
                  src={thumbnailUrl}
                  onClick={() => {
                    setItemToDelete(_id);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              </Tooltip>
            ))}
          </Box>
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
                  } catch (error) {
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
          <StyledDivider />
          <Typography variant="h3">Delete Users</Typography>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {users.map(({ _id, image, name }: User) => (
              <Tooltip key={String(_id)} title={name}>
                <MediumAvatar
                  style={{ margin: ".5rem", cursor: "pointer" }}
                  alt={name}
                  src={image}
                  onClick={() => {
                    setUserToDelete(_id);
                    setIsUserDeleteDialogOpen(true);
                  }}
                />
              </Tooltip>
            ))}
          </Box>
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
                  } catch (error) {
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
