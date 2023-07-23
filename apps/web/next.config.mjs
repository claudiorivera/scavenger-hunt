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
		"@claudiorivera/shared",
	],
	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
	images: {
		domains: [
			"res.cloudinary.com",
			"claudiorivera.com",
			"loremflickr.com",
			"picsum.photos",
			"avatars.githubusercontent.com",
			"cloudflare-ipfs.com",
		],
	},
};

export default config;
