import {
  AppBar,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { appTitle } from "config";
import Link from "next/link";

import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

const useStyles = makeStyles({
  appBar: {
    marginBottom: "2rem",
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "white",
    fontWeight: 700,
    fontSize: "1.5rem",
    cursor: "pointer",
  },
});

export const MainAppBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="sticky">
      <Toolbar>
        <Link href="/" passHref>
          <Typography className={classes.title}>{appTitle}</Typography>
        </Link>
        {isMobile ? <MobileMenu /> : <DesktopMenu />}
      </Toolbar>
    </AppBar>
  );
};
