/** @typedef  {import("prettier").Config} PrettierConfig*/
/** @typedef  {{ tailwindConfig: string }} TailwindConfig*/

/** @type { PrettierConfig | TailwindConfig } */
const config = {
	useTabs: true,
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindConfig: "./packages/config/tailwind",
};

module.exports = config;
