import { Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export const NotLoggedInMessage = () => (
  <>
    <Typography variant="h5" align="center" gutterBottom>
      Welcome to Scavenger Hunt! Sign in to get started.
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
      Sign In
    </Button>
  </>
);
