import {
  Avatar,
  Button,
  Container,
  styled,
  Typography,
} from "@material-ui/core";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";

const LargeAvatar = styled(Avatar)({
  width: "5rem",
  height: "5rem",
});

const StyledButton = styled(Button)({
  margin: ".5rem .25rem",
});

const AdminPage = () => {
  const [session] = useSession();
  const router = useRouter();

  if (!session)
    return (
      <Container>
        <Typography variant="h5" align="center">
          Welcome. Please login.
        </Typography>
        <Button
          type="submit"
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

  return (
    <Container align="center">
      <Typography variant="h3">ADMIN PAGE</Typography>
      <LargeAvatar alt={session.user.name} src={session.user.image} />
      <Typography variant="body1">{session.user.name}</Typography>
      <Typography variant="body1">
        Is admin? {session.user.isAdmin ? "Yes" : "No"}
      </Typography>
    </Container>
  );
};

export default AdminPage;
