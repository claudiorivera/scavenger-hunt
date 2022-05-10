import { Button } from "@mui/material";
import { adminLinks, userLinks } from "config";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export const DesktopMenu = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
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
        Sign Out
      </Button>
    </>
  );
};
