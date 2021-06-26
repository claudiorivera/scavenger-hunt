import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { Link } from "interfaces/types";
import { signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { StyledLink } from "./shared";

interface MobileMenuProps {
  userLinks: Link[];
  adminLinks: Link[];
}

const MobileMenu = ({ userLinks, adminLinks }: MobileMenuProps) => {
  const [session, loading] = useSession();
  const router = useRouter();

  // https://material-ui.com/components/app-bar/#app-bar-with-menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event: PointerEvent) => {
    // TODO: Find the correct way to do this
    setAnchorEl(event.currentTarget as any);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={(e) => {
          // TODO: Find the correct way to do this
          handleMenuOpen(e as any);
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
    </Fragment>
  );
};

export default MobileMenu;
