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
} from "@material-ui/core";
import { CollectedItem, Item, User } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { StyledButton } from "~components";
import { useUser } from "~contexts";
import { capitalizeEachWordOfString } from "~lib";

type PopulatedCollectedItem = CollectedItem & {
  originalItem: Item;
};

const AdminPage = () => {
  const { user, error, refreshUser } = useUser();
  const [description, setDescription] = useState("");
  const { data: collectedItems, mutate: mutateCollectionItems } = useSWR<
    PopulatedCollectedItem[]
  >("/api/collected-items");
  const { data: users, mutate: mutateUsers } = useSWR<User[]>("/api/users");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectedItemIdToDelete, setCollectedItemIdToDelete] =
    useState<string>();
  const [isProfileDeleteDialogOpen, setIsProfileDeleteDialogOpen] =
    useState(false);
  const [userIdToDelete, setuserIdToDelete] = useState<string>();

  useEffect(() => {
    refreshUser();
  }, [collectedItems, refreshUser]);

  if (error) return <div>Oops, try refreshing!</div>;
  if (!user) return <div>Loading...</div>;

  if (!user.isAdmin)
    return (
      <Typography variant="h5" align="center" gutterBottom>
        You must be signed in as an admin to view this page.
      </Typography>
    );

  const handleSubmit = async (description: string) => {
    try {
      await axios.post("/api/items", { description });
    } catch (error: any) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  // TODO: separeate into three complonents (ie. <AddItem />, <DeleteCollectedItem />, <DeleteUser />)
  return (
    <>
      <Typography variant="h3" align="center">
        Add New Item
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(description);
          setDescription("");
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
          value={description}
          onChange={(e) =>
            setDescription(capitalizeEachWordOfString(e.target.value))
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
      {collectedItems && (
        <>
          <Typography variant="h3" align="center">
            Delete Collection Items
          </Typography>
          <Grid
            container
            justifyContent="center"
            style={{ marginBottom: "2rem" }}
          >
            {collectedItems.map(({ id, thumbnailUrl, originalItem }) => (
              <Grid item key={id}>
                <Tooltip title={originalItem.description}>
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
                      setCollectedItemIdToDelete(id);
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
                    await axios.delete(
                      `/api/collected-items/${collectedItemIdToDelete}`
                    );
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
          <Typography variant="h3" align="center">
            Delete Users
          </Typography>
          <Grid
            container
            justifyContent="center"
            style={{ marginBottom: "2rem" }}
          >
            {users.map(({ id, image, name }) => (
              <Tooltip key={id} title={name!}>
                <Avatar
                  style={{
                    margin: ".5rem",
                    cursor: "pointer",
                    width: "3rem",
                    height: "3rem",
                  }}
                  alt={name!}
                  src={image!}
                  onClick={() => {
                    setuserIdToDelete(id);
                    setIsProfileDeleteDialogOpen(true);
                  }}
                />
              </Tooltip>
            ))}
          </Grid>
          <Dialog
            open={isProfileDeleteDialogOpen}
            onClose={() => {
              setIsProfileDeleteDialogOpen(false);
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
                  setIsProfileDeleteDialogOpen(false);
                }}
                color="secondary"
                variant="outlined"
              >
                No
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await axios.delete(`/api/users/${userIdToDelete}`);
                    setIsProfileDeleteDialogOpen(false);
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

AdminPage.requireAuth = true;

export default AdminPage;
