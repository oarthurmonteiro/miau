const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [
		heroui({
			themes: {
				light: {
					colors: {
						default: {
							DEFAULT: "#e6e6fa",
							100: "#e6e6fa",
						},
						primary: {
							DEFAULT: "#f8cd0e",
						},
						secondary: {
							DEFAULT: "#ffc2c2",
						},
						dark: {
							DEFAULT: "#37455a",
						}
					},
				},
			},
		}),
	],
};
