"use client";

import Image from "next/image";
import { HiUserCircle } from "react-icons/hi";

import { api } from "~/utils/api";

export const HomePageHeader = () => {
  const { data: user } = api.users.me.useQuery();

  return (
    <>
      <div className="avatar">
        <div className="relative h-24 w-24 rounded-full">
          {user?.image ? (
            <Image src={user.image} fill alt={`${user.name}`} sizes="33vw" />
          ) : (
            <HiUserCircle className="h-full w-full" />
          )}
        </div>
      </div>
      <header className="text-2xl">{user?.name ?? "Anonymous User"}</header>
    </>
  );
};
