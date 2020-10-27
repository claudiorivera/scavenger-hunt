import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";

const MobileMenu = ({ userLinks, adminLinks }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  // https://material-ui.com/components/app-bar/#app-bar-with-menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
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
        onClick={handleMenuOpen}
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
          <MenuItem onClick={signIn}>Login</MenuItem>
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
