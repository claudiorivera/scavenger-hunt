// Importing env files here to validate on build
import "@claudiorivera/auth/env.mjs";
import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	/** Enables hot reloading for local packages without a build step */
	transpilePackages: [
		"@claudiorivera/api",
		"@claudiorivera/auth",
		"@claudiorivera/db",
	],
	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "claudiorivera.com",
			},
			{
				protocol: "https",
				hostname: "loremflickr.com",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "cloudflare-ipfs.com",
			},
		],
	},
};

export default config;
