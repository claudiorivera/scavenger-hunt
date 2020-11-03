import LoginForm from "@components/LoginForm";
import { Container } from "@material-ui/core";
import { GetServerSideProps } from "next";
import { providers } from "next-auth/client";
import React from "react";

const AuthLoginPage = ({
  providers,
}: {
  providers: {
    id: string;
    name: string;
  }[];
}) => (
  <Container maxWidth="xs">
    <LoginForm providers={providers} />
  </Container>
);

export default AuthLoginPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await providers(),
    },
  };
};
