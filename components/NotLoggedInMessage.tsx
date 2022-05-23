import { Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

const NotLoggedInMessage = () => (
  <>
    <Typography variant="h5" align="center" gutterBottom>
      You must be logged in to view this page
    </Typography>
    <Button
      size="large"
      fullWidth
      color="secondary"
      variant="contained"
      onClick={() => {
        signIn();
      }}
    >
      Login
    </Button>
  </>
);

export default NotLoggedInMessage;
