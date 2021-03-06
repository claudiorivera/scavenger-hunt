import {
  AppBar,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { styled, useTheme } from "@material-ui/core/styles";
import { adminLinks, appTitle, userLinks } from "config";
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import MobileMenu from "./MobileMenu";

const Title = styled(Typography)({
  flexGrow: 1,
  textDecoration: "none",
  color: "white",
  fontWeight: 700,
  fontSize: "1.5rem",
  cursor: "pointer",
});

const StyledAppBar = styled(AppBar)({
  marginBottom: "2rem",
});

const MainAppBar = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isOnLoginPage = router.asPath.startsWith("/auth/login");

  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <Link href="/" passHref>
          <Title>{appTitle}</Title>
        </Link>
        {isOnLoginPage ? null : isMobile ? (
          <MobileMenu userLinks={userLinks} adminLinks={adminLinks} />
        ) : loading ? (
          <CircularProgress />
        ) : !session ? (
          <Link passHref href="/auth/login">
            <Button color="inherit">Login</Button>
          </Link>
        ) : (
          <>
            {userLinks.map(({ title, url }) => (
              <Link passHref key={title} href={url}>
                <Button color="inherit">{title}</Button>
              </Link>
            ))}
            {session.user.isAdmin &&
              adminLinks.map(({ title, url }) => (
                <Link passHref key={title} href={url}>
                  <Button color="inherit">{title}</Button>
                </Link>
              ))}
            <Button
              color="inherit"
              onClick={() => {
                signOut();
              }}
            >
              Log Out
            </Button>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default MainAppBar;
