import MediumAvatar from "@components/MediumAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import StyledDivider from "@components/StyledDivider";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { capitalizeLetters } from "@util/capitalizeLetters";
import useCurrentUser from "@util/useCurrentUser";
import Axios from "axios";
import { useSession } from "next-auth/client";
import Error from "next/error";
import React, { useState } from "react";
import useSWR from "swr";

const AdminPage = () => {
  const [session] = useSession();
  const { user } = useCurrentUser();
  const [itemDescription, setItemDescription] = useState("");
  const { data: items, mutate } = useSWR("/api/collectionitems");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number>();

  if (!session) return <NotLoggedInMessage />;
  if (!user) return null;
  if (!user.isAdmin)
    return (
      <Container maxWidth="xs">
        <Typography variant="h5" align="center">
          You must be logged in as an admin to view this page.
        </Typography>
      </Container>
    );

  const handleSubmit = async (itemDescription: string) => {
    try {
      await Axios.post("/api/items", { itemDescription });
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h3">
        Admin
      </Typography>
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
            setItemDescription(capitalizeLetters(e.target.value))
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
      <StyledDivider />
      {items && (
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {items.map(
            ({ _id, thumbnailUrl }: { _id: number; thumbnailUrl: string }) => (
              <MediumAvatar
                key={_id}
                style={{ margin: ".5rem", cursor: "pointer" }}
                alt={"a collection item"}
                src={thumbnailUrl}
                onClick={() => {
                  setItemToDelete(_id);
                  setIsDeleteDialogOpen(true);
                }}
              />
            )
          )}
        </Box>
      )}
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
                await Axios.delete(`/api/collectionitems/${itemToDelete}`);
                setIsDeleteDialogOpen(false);
                mutate();
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
    </Container>
  );
};

export default AdminPage;
