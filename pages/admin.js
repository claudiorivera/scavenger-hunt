import {
  Avatar,
  Button,
  Container,
  styled,
  Typography,
} from "@material-ui/core";
import { getSession, signIn, useSession } from "next-auth/client";
import React from "react";
import middleware from "../middleware";
import User from "../models/User";

const LargeAvatar = styled(Avatar)({
  width: "5rem",
  height: "5rem",
});

const AdminPage = ({ user }) => {
  const [session] = useSession();

  if (!session || !user || !user.isAdmin)
    return (
      <Container>
        <Typography variant="h5" align="center">
          You must be logged in as an admin to view this content.
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
      <LargeAvatar alt={user.name} src={user.image} />
      <Typography variant="body1">{user.name}</Typography>
      <Typography variant="body1">
        Is admin? {user.isAdmin ? "Yes" : "No"}
      </Typography>
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
