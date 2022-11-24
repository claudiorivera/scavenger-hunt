import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineX,
} from "react-icons/hi";

import { links } from "./DefaultLayout";

type Props = {
  handleToggle: () => void;
};

export const SideBar = ({ handleToggle }: Props) => {
  const { data: session } = useSession();

  const Menu = () => (
    <ul className="flex-grow">
      {session &&
        links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      {session && (
        <>
          <li>
            <Link href={`/users/${session?.user?.id}/edit`}>
              <HiOutlineUser />
              My Profile
            </Link>
          </li>
          <li>
            <a onClick={() => signOut()}>
              <HiOutlineLogout />
              <span>Sign Out</span>
            </a>
          </li>
        </>
      )}
      {!session && (
        <li>
          <Link href={"/sign-in"}>
            <HiOutlineLogin />
            Sign In
          </Link>
        </li>
      )}
    </ul>
  );

  return (
    <aside className="drawer-side">
      <div onClick={handleToggle} className="drawer-overlay" />
      <div className="menu flex w-80 flex-col justify-center overflow-y-auto bg-base-100 p-4 text-base-content">
        <div className="absolute top-2 left-2">
          <button onClick={handleToggle} className="btn-ghost btn-circle btn">
            <HiOutlineX />
          </button>
        </div>
        <Link href={"/"} className="flex flex-col items-center">
          <div className="w-1/2">Scavenger Hunt</div>
          <label className="font-thin uppercase">Branch Organizer</label>
        </Link>
        <div className="divider p-4 before:bg-primary after:bg-primary" />
        <Menu />
      </div>
    </aside>
  );
};
