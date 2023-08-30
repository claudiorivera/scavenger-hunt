import type { Config } from "tailwindcss";

import baseConfig from "@claudiorivera/tailwind-config";

export default {
	content: ["./src/**/*.{ts,tsx}"],
	presets: [baseConfig],
	plugins: [require("daisyui")],
} satisfies Config;
