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
import MobileMenu from "./MobileMenu";

const MainAppBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      sx={{
        marginBottom: 4,
      }}
      position="sticky"
    >
      <Toolbar>
        <Link href="/">
          <Typography
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "white",
              fontWeight: 700,
              fontSize: "1.5rem",
              cursor: "pointer",
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

export default MainAppBar;
