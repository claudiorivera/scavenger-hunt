import { LoginForm } from "components";
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
  <LoginForm providers={providers} />
);

export default AuthLoginPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      providers: await providers(),
    },
  };
};
