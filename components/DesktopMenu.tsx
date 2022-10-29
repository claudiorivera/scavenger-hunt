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
        <Button color="inherit" key={title} href={url} LinkComponent={Link}>
          {title}
        </Button>
      ))}
      {session.user.isAdmin &&
        adminLinks.map(({ title, url }) => (
          <Button color="inherit" key={title} href={url} LinkComponent={Link}>
            {title}
          </Button>
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
