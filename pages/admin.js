import StyledButton from "@components/StyledButton";
import { Container, TextField, Typography } from "@material-ui/core";
import middleware from "@middleware";
import User from "@models/User";
import { capitalizeLetters } from "@util/capitalizeLetters";
import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/client";
import React, { useState } from "react";

const AdminPage = ({ user }) => {
  const [session] = useSession();
  const [itemDescription, setItemDescription] = useState("");

  if (!session || !user || !user.isAdmin)
    return (
      <Container maxWidth="xs">
        <Typography variant="h5" align="center">
          You must be logged in as an admin to view this content.
        </Typography>
        <StyledButton
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={signIn}
        >
          Login
        </StyledButton>
      </Container>
    );

  const handleSubmit = async (itemDescription) => {
    try {
      const response = await axios.post("/api/items", { itemDescription });
      alert(`response: ${JSON.stringify(response.data.message)}`);
    } catch (error) {
      console.error(error);
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

export const getServerSideProps = async ({ req, res }) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      res.writeHead(301, {
        Location: "/auth/login",
      });
      res.end();
      throw new Error("Not logged in");
    }
    await middleware.apply(req, res);
    const user = await User.findById(session.user.id)
      .select("isAdmin -_id")
      .lean();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return {
      props: {
        error: {
          statusCode: error.statusCode || 500,
          message:
            error.message ||
            "Something went wrong while getting server side props in admin.js",
        },
      },
    };
  }
};
