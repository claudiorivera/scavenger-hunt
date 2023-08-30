import Image from "next/image";
import classNames from "classnames";
import { HiUserCircle } from "react-icons/hi";

type ImageSize = "sm" | "md" | "lg";

const smallSizeClasses = "h-14 w-14";
const mediumSizeClasses = "h-24 w-24";
const largeSizeClasses = "h-28 w-28";

export function Avatar({
	imageSrc,
	size = "md",
}: {
	imageSrc?: string | null;
	size?: ImageSize;
}) {
	return (
		<div className="avatar">
			<div
				className={classNames("relative rounded-full", {
					[smallSizeClasses]: size === "sm",
					[mediumSizeClasses]: size === "md",
					[largeSizeClasses]: size === "lg",
				})}
			>
				{imageSrc ? (
					<Image alt="" fill src={imageSrc} />
				) : (
					<HiUserCircle className="h-full w-full" />
				)}
			</div>
		</div>
	);
}
