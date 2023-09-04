import baseConfig from "@claudiorivera/tailwind-config";
import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{ts,tsx}"],
	presets: [baseConfig],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: "#BF360C",
					"primary-content": "#ffffff",
					secondary: "#ffc107",
					accent: "#BC6C25",
					neutral: "#323031",
					"base-100": "#FFFFFF",
					info: "#3ABFF8",
					success: "#36D399",
					warning: "#FBBD23",
					error: "#F87272",
				},
			},
		],
	},
	plugins: [require("daisyui")],
} satisfies Config;
