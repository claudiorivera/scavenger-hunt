import { Container, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";

const MaintenanceModeMessage = () => (
  <Container maxWidth="xs">
    <Typography variant="h5" align="center">
      Hi, there! This development version is in maintenance mode, which means
      there's nothing to see here. Please visit the{" "}
      <Link href="https://scavenger-hunt.claudiorivera.com">
        production version
      </Link>
      , instead!
    </Typography>
  </Container>
);

export default MaintenanceModeMessage;
