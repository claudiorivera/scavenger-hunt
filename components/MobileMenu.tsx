import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Link } from "types";

import { StyledLink } from "./shared";

interface MobileMenuProps {
  userLinks: Link[];
  adminLinks: Link[];
}

const MobileMenu = ({ userLinks, adminLinks }: MobileMenuProps) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  // https://material-ui.com/components/app-bar/#app-bar-with-menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMobileMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={(e) => {
          handleMenuOpen(e);
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMobileMenuOpen}
        onClose={handleMenuClose}
      >
        {loading ? (
          <CircularProgress />
        ) : !session ? (
          <MenuItem>
            <StyledLink color="inherit" href="/auth/login">
              Login
            </StyledLink>
          </MenuItem>
        ) : (
          <div>
            {userLinks.map(({ url, title }) => (
              <MenuItem
                key={title}
                onClick={() => {
                  handleMenuClose();
                  router.push(url);
                }}
              >
                {title}
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => {
                handleMenuClose();
                signOut();
              }}
            >
              Log Out
            </MenuItem>
            {session.user.isAdmin &&
              adminLinks.map(({ title, url }) => (
                <MenuItem
                  key={title}
                  onClick={() => {
                    handleMenuClose();
                    router.push(url);
                  }}
                >
                  {title}
                </MenuItem>
              ))}
          </div>
        )}
      </Menu>
    </>
  );
};

export default MobileMenu;
