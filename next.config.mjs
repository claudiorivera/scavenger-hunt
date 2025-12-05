import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
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
