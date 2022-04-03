import { Button } from "@material-ui/core";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { adminLinks, userLinks } from "~config";
import { useUser } from "~contexts";

export const DesktopMenu = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <>
      {userLinks.map(({ title, url }) => (
        <Link passHref key={title} href={url}>
          <Button color="inherit">{title}</Button>
        </Link>
      ))}
      {user.isAdmin &&
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
        Sign Out
      </Button>
    </>
  );
};
