import { Button, Divider, TextField, Typography } from "@material-ui/core";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { useState } from "react";

import { useUser } from "~contexts";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await getProviders(),
    },
  };
};

type SignInPageProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};
export const SignInPage = ({ providers }: SignInPageProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) router.push("/");

  return (
    <>
      <Typography variant="h5">
        Please sign in with one of the following:
      </Typography>
      {providers &&
        Object.values(providers)
          .filter((provider) => provider.id !== "email")
          .map((provider) => (
            <Button
              key={provider.id}
              type="submit"
              size="large"
              fullWidth
              color="secondary"
              variant="contained"
              onClick={() => {
                signIn(provider.id, { callbackUrl: "/" });
              }}
            >
              {provider.name}
            </Button>
          ))}
      <Divider />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsLoading(true);
          signIn("email", { email, callbackUrl: "/" });
        }}
      >
        <TextField
          name="email"
          required
          id="email"
          label="Email"
          placeholder="Or enter your email here to receive a sign-in link"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          disabled={isLoading}
        >
          Send sign-in link
        </Button>
      </form>
    </>
  );
};

export default SignInPage;
