"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { HiUserCircle } from "react-icons/hi";

export function Avatar({ imageSrc }: { imageSrc?: string }) {
	const { data: session } = useSession();

	const image = imageSrc ?? session?.user?.image;

	return (
		<div className="avatar">
			<div className="w-28 rounded-full">
				{image ? (
					<Image alt="" height={150} width={150} src={image} />
				) : (
					<HiUserCircle className="h-full w-full" />
				)}
			</div>
		</div>
	);
}
