import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { appTitle } from "config";

import { DesktopMenu } from "./DesktopMenu";
import { Link } from "./Link";
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
        <Link href="/" sx={{ mr: "auto" }}>
          <Typography
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: theme.palette.primary.contrastText,
              fontWeight: 700,
              fontSize: "1.5rem",
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
