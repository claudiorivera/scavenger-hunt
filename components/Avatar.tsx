"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { HiUserCircle } from "react-icons/hi";

type Props = {
  imageSrc?: string;
};
export const Avatar = ({ imageSrc }: Props) => {
  const { data: session } = useSession();

  const image = imageSrc ?? session?.user?.image;

  return image ? (
    <Image alt="" height={150} width={150} src={image} />
  ) : (
    <HiUserCircle className="h-10 w-10" />
  );
};
