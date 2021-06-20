import LoginForm from "@components/LoginForm";
import { Container } from "@material-ui/core";
import { GetServerSideProps } from "next";
import { providers } from "next-auth/client";
import React from "react";

interface AuthLoginPageProps {
  providers: {
    id: string;
    name: string;
  }[];
}

const AuthLoginPage = ({ providers }: AuthLoginPageProps) => (
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
