import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { adminLinks, userLinks } from "config";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export const MobileMenu = () => {
  const { data: session } = useSession();
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

  if (!session) return null;

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={(e) => {
          handleMenuOpen(e);
        }}
        size="large"
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
        <Box>
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
            Sign Out
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
        </Box>
      </Menu>
    </>
  );
};
