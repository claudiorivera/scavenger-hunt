import { TextField, Typography } from "@material-ui/core";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { SonicWaiting, StyledButton } from "./shared";

interface LoginFormProps {
  providers: {
    id: string;
    name: string;
  }[];
}

const LoginForm = ({ providers }: LoginFormProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  if (session) router.push("/");

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Please login with one of the following:
      </Typography>
      {providers &&
        Object.values(providers)
          .filter((provider) => provider.id !== "email")
          .map((provider) => (
            <StyledButton
              key={provider.id}
              type="submit"
              size="large"
              fullWidth
              color="secondary"
              variant="contained"
              onClick={() => {
                signIn(provider.id);
              }}
            >
              {provider.name}
            </StyledButton>
          ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsFetching(true);
          signIn("email", { email });
        }}
        style={{ width: "100%" }}
      >
        <TextField
          name="email"
          required
          id="email"
          label="Email"
          placeholder="Or enter your email here to receive a login link"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledButton
          type="submit"
          size="large"
          fullWidth
          color="secondary"
          variant="contained"
          disabled={isFetching}
        >
          {isFetching ? <SonicWaiting /> : "Send Me A Login Link"}
        </StyledButton>
      </form>
    </>
  );
};

export default LoginForm;
