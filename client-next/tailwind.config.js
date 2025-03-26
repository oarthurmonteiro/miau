import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
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
              100: "#e6e6fa",
            },
						primary: "#f8cd0e",
						secondary: "#ffc2c2",
						dark: "#37455a",
					},
				},
			},
		}),
  ]
}