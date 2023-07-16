/** @type {import("eslint").Linter.Config} */
const config = {
	root: true,
	extends: ["@claudiorivera/eslint-config"], // uses the config in `packages/config/eslint`
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		tsconfigRootDir: __dirname,
		project: true,
	},
	settings: {
		next: {
			rootDir: ["apps/nextjs"],
		},
	},
	rules: {
		"@typescript-eslint/no-misused-promises": [
			"error",
			{ checksVoidReturn: { attributes: false } },
		],
	},
};

module.exports = config;
