import StyledButton from "@components/StyledButton";
import { Container, TextField, Typography } from "@material-ui/core";
import { capitalizeLetters } from "@util/capitalizeLetters";
import useCurrentUser from "@util/useCurrentUser";
import Axios from "axios";
import { useSession } from "next-auth/client";
import Error from "next/error";
import React, { useState } from "react";

const AdminPage = () => {
  const [session] = useSession();
  const { user } = useCurrentUser();
  const [itemDescription, setItemDescription] = useState("");

  if (!session) return <NotLoggedInMessage />;

  if (!user?.isAdmin)
    return (
      <Container maxWidth="xs">
        <Typography variant="h5" align="center">
          You must be logged in as an admin to view this page.
        </Typography>
      </Container>
    );

  const handleSubmit = async (itemDescription) => {
    try {
      await Axios.post("/api/items", { itemDescription });
    } catch (error) {
      return <Error statusCode={500} title={error.message} />;
    }
  };

  return (
    <Container align="center" maxWidth="xs">
      <Typography variant="h3">Admin</Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(itemDescription);
          setItemDescription("");
        }}
      >
        <TextField
          autoFocus="true"
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
    </Container>
  );
};

export default AdminPage;
