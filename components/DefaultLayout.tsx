import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlineMenuAlt3,
  HiOutlineTag,
} from "react-icons/hi";

import { SideBar } from "./SideBar";

export const links = [
  {
    href: "/",
    label: "Home",
    icon: <HiOutlineHome />,
  },
  {
    href: "/events",
    label: "Events",
    icon: <HiOutlineCalendar />,
  },
  {
    href: "/locations",
    label: "Locations",
    icon: <HiOutlineLocationMarker />,
  },
  {
    href: "/event-categories",
    label: "Event Categories",
    icon: <HiOutlineTag />,
  },
];

type Props = {
  children: ReactNode;
};

export const DefaultLayout = ({ children }: Props) => {
  const { data: session } = useSession();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const { pathname } = useRouter();

  useEffect(() => {
    setIsSideBarOpen(false);
  }, [pathname]);

  const handleSideBarToggle = () => setIsSideBarOpen(!isSideBarOpen);

  return (
    <>
      <Head>
        <title>Branch Organizer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="drawer">
        <input
          id="drawer-toggle"
          type="checkbox"
          className="drawer-toggle"
          checked={isSideBarOpen}
          readOnly
        />
        <div className="drawer-content">
          <nav className="navbar bg-base-100 text-base-content shadow-sm shadow-primary">
            <button
              onClick={handleSideBarToggle}
              className="btn-ghost btn-circle btn md:hidden"
            >
              <HiOutlineMenuAlt3 />
            </button>
            <Link href={"/"} className="mx-auto md:mr-auto md:ml-0">
              <div className="flex items-center gap-3 p-2">
                <div className="hidden text-lg font-thin uppercase leading-tight md:block">
                  Scavenger Hunt
                </div>
              </div>
            </Link>
            <div className="hidden flex-none md:block">
              <ul className="menu menu-horizontal p-2">
                {session &&
                  links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        {link.icon}
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </nav>
          <main>{children}</main>
        </div>
        <SideBar handleToggle={handleSideBarToggle} />
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};
