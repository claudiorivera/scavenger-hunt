import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { appTitle } from "config";
import Link from "next/link";

import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

export const MainAppBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      sx={{
        mb: 4,
      }}
      position="sticky"
    >
      <Toolbar>
        <Link href="/">
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {appTitle}
          </Typography>
        </Link>
        {isMobile ? <MobileMenu /> : <DesktopMenu />}
      </Toolbar>
    </AppBar>
  );
};
