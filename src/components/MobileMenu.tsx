import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { adminLinks, userLinks } from "~config";
import { useUser } from "~contexts";

export const MobileMenu = () => {
  const router = useRouter();
  const { user } = useUser();

  // https://material-ui.com/components/app-bar/#app-bar-with-menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isMobileMenuOpen = !!anchorEl;
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!user) return null;

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
        {user.isAdmin &&
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
        <MenuItem
          onClick={() => {
            handleMenuClose();
            signOut();
          }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};
