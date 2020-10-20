import {
  Button,
  Container,
  styled,
  TextField,
  Typography,
} from "@material-ui/core";
import middleware from "@middleware";
import User from "@models/User";
import { capitalizeLetters } from "@util/capitalizeLetters";
import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/client";
import React, { useState } from "react";

const StyledButton = styled(Button)({
  margin: ".5rem .25rem",
});

const AdminPage = ({ user }) => {
  const [session] = useSession();
  const [itemDescription, setItemDescription] = useState("");

  if (!session || !user || !user.isAdmin)
    return (
      <Container>
        <Typography variant="h5" align="center">
          You must be logged in as an admin to view this content.
        </Typography>
        <Button
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          onClick={signIn}
        >
          Login
        </Button>
      </Container>
    );

  const handleSubmit = async (itemDescription) => {
    try {
      const response = await axios.post("/api/items", { itemDescription });
      console.log(`response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container align="center">
      <Typography variant="h3">ADMIN PAGE</Typography>
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
  const session = await getSession({ req });
  if (session) {
    await middleware.apply(req, res);
    const user = await User.findById(session.user.id).lean();
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } else
    return {
      props: {
        user: null,
      },
    };
};
