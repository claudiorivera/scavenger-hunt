"use client";

import Link from "next/link";

import { userLinks } from "../constants";

export const MainAppBar = () => {
  return (
    <div className="navbar bg-primary text-primary-content p-4">
      <div className="flex-1">
        <Link href="/" className="font-bold text-2xl hover:text-primary-focus">
          Scavenger Hunt
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-52"
          >
            <>
              {userLinks.map((link) => (
                <li key={link.url}>
                  <Link href={link.url}>{link.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/api/auth/signout">Sign out</Link>
              </li>
            </>
          </ul>
        </div>
      </div>
    </div>
  );
};
