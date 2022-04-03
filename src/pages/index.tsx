import { Avatar, Typography } from "@material-ui/core";
import { useRouter } from "next/router";

import { StyledButton } from "~components";
import { useUser } from "~contexts";

const HomePage = () => {
  const router = useRouter();
  const { user, error } = useUser();

  if (error) return <div>{error.message}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Avatar
        alt={user.name!}
        src={user.image!}
        style={{ width: "5rem", height: "5rem", margin: "0 auto" }}
      />
      <Typography variant="h5" align="center" gutterBottom>
        {user.name}
      </Typography>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/collect");
        }}
      >
        Collect Items
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/leaderboard");
        }}
      >
        Leaderboard
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push(`/users/${user.id}/collection`);
        }}
      >
        My Collection
      </StyledButton>
      <StyledButton
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          router.push("/user");
        }}
      >
        My Profile
      </StyledButton>
    </>
  );
};

HomePage.requireAuth = true;

export default HomePage;
