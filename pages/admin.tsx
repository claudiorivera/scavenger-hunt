import MediumAvatar from "@components/MediumAvatar";
import NotLoggedInMessage from "@components/NotLoggedInMessage";
import StyledButton from "@components/StyledButton";
import StyledDivider from "@components/StyledDivider";
import { Box, Container, TextField, Typography } from "@material-ui/core";
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
  const { data: items, mutate } = useSWR("/api/collections");

  if (!session) return <NotLoggedInMessage />;

  if (!user?.isAdmin)
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
      {/* TODO: Add confirmation and style the pointer */}
      {items && (
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {items.map(
            ({ _id, thumbnailUrl }: { _id: number; thumbnailUrl: string }) => (
              <MediumAvatar
                key={_id}
                style={{ margin: ".5rem" }}
                alt={"a collection item"}
                src={thumbnailUrl}
                onClick={async () => {
                  try {
                    await Axios.delete(`/api/collections/${_id}`);
                    mutate();
                  } catch (error) {
                    return <Error statusCode={500} title={error.message} />;
                  }
                }}
              />
            )
          )}
        </Box>
      )}
    </Container>
  );
};

export default AdminPage;
