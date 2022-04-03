import { Container } from "@material-ui/core";
import { ReactNode } from "react";

import { MainAppBar } from "./MainAppBar";

type LayoutProps = {
  children: ReactNode;
};
export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <MainAppBar />
      <Container maxWidth="xs">
        <main>{children}</main>
      </Container>
    </>
  );
};
