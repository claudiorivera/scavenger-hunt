import { LoadingButton } from "@mui/lab";
import { Button, TextField, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { nextAuthOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);

  if (session) {
    return {
      redirect: {
        destination: query.callbackUrl || "/",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export const SignInPage = () => {
  const router = useRouter();
  const { callbackUrl } = router.query as { callbackUrl: string };
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Welcome to Scavenger Hunt! Sign in to get started.
      </Typography>
      <Button
        sx={{
          my: 1,
        }}
        type="submit"
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          signIn("credentials", { callbackUrl });
        }}
      >
        Sign In As Demo User
      </Button>
      <Button
        sx={{
          my: 1,
        }}
        type="submit"
        size="large"
        fullWidth
        color="secondary"
        variant="contained"
        onClick={() => {
          signIn("github", { callbackUrl });
        }}
      >
        Sign In With GitHub
      </Button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          signIn("email", { email, callbackUrl });
        }}
      >
        <TextField
          name="email"
          required
          id="email"
          label="Email"
          placeholder="email@example.com"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoadingButton
          sx={{
            my: 1,
          }}
          type="submit"
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          disabled={isLoading}
          loading={isLoading}
        >
          Sign In With Email
        </LoadingButton>
      </form>
    </>
  );
};

export default SignInPage;
